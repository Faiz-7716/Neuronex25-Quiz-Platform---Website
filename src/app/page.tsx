
"use client";

import * as React from 'react';
import Link from 'next/link';
import type { Team, Question, GameState } from '@/lib/types';
import { initialTeams, allQuestions, roundDetails, tieBreakerQuestions } from '@/lib/data';
import { AnimatePresence } from 'framer-motion';
import { FileText, Users, Save, RotateCcw, Swords, Trophy } from 'lucide-react';

import IntroScreen from '@/components/quiz/intro-screen';
import RoundTransition from '@/components/quiz/round-transition';
import RoundSummary from '@/components/quiz/round-summary';
import Scoreboard from '@/components/quiz/scoreboard';
import QuestionGrid from '@/components/quiz/question-grid';
import QuestionModal from '@/components/quiz/question-modal';
import FinalLeaderboard from '@/components/quiz/final-leaderboard';
import RulesDialog from '@/components/quiz/rules-dialog';
import RoundSelector from '@/components/quiz/round-selector';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const LOCAL_STORAGE_KEY = 'quizGameState';

export default function Home() {
  const [gameState, setGameState] = React.useState<GameState>('intro');
  const [currentRound, setCurrentRound] = React.useState<number>(1);
  const [teams, setTeams] = React.useState<Team[]>(initialTeams);
  const [questions, setQuestions] = React.useState<Question[]>(allQuestions);
  const [activeQuestion, setActiveQuestion] = React.useState<Question | null>(null);
  const [activeTeamIndex, setActiveTeamIndex] = React.useState<number>(0);
  const [isRulesOpen, setIsRulesOpen] = React.useState(false);

  // Tie-breaker state
  const [tieBreakerState, setTieBreakerState] = React.useState<{
    tiedTeams: Team[];
    teamsToAdvance: number;
    safeTeams: Team[];
    questionIndex: number;
  } | null>(null);


  const { toast } = useToast();
  const activeTeams = teams.filter(t => t.status === 'active');
  
  React.useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        if (savedState) {
          setGameState(savedState.gameState || 'intro');
          setCurrentRound(savedState.currentRound || 1);
          setTeams(savedState.teams || initialTeams);
          setQuestions(savedState.questions || allQuestions);
          setActiveTeamIndex(savedState.activeTeamIndex || 0);
          toast({
            title: "Game Loaded",
            description: "Your previous game state has been restored.",
          });
        }
      }
    } catch (error) {
      console.error("Failed to load state from local storage", error);
      toast({
        title: "Load Error",
        description: "Could not restore your previous game.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const saveState = React.useCallback((showToast: boolean = false) => {
    try {
      const stateToSave = {
        gameState,
        currentRound,
        teams,
        questions,
        activeTeamIndex,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      if (showToast) {
        toast({
          title: "Progress Saved",
          description: "Your game progress has been saved successfully.",
        });
      }
    } catch (error) {
       console.error("Failed to save state to local storage", error);
       if (showToast) {
         toast({
          title: "Save Error",
          description: "Could not save your game progress.",
          variant: "destructive",
        });
       }
    }
  }, [gameState, currentRound, teams, questions, activeTeamIndex, toast]);

  React.useEffect(() => {
    if (gameState !== 'intro' && gameState !== 'tie-breaker') {
      saveState(false); // Auto-save silently
    }
  }, [gameState, currentRound, teams, questions, activeTeamIndex, saveState]);

  const startQuiz = () => {
    setGameState('transition');
  };

  const startRound = () => {
    setGameState('round');
    // Ensure activeTeamIndex is valid for the current set of active teams
    const currentActiveTeams = teams.filter(t => t.status === 'active');
    if (activeTeamIndex >= currentActiveTeams.length) {
      setActiveTeamIndex(0);
    }
  };

  const handleSelectQuestion = (question: Question) => {
    if (question.status !== 'available') {
      toast({
        title: 'Question Unavailable',
        description: 'This question has already been attempted.',
        variant: 'destructive',
      });
      return;
    }
    setQuestions(prev => prev.map(q => q.id === question.id ? { ...q, status: 'attempted' } : q));
    setActiveQuestion(question);
  };
  
  const handleModalClose = () => {
    if (!activeQuestion) return;
    
    const wasAnswered = activeQuestion.status === 'correct' || activeQuestion.status === 'wrong';

    if (gameState === 'tie-breaker') {
      handleTieBreakerAnswer(false);
    } else {
       // Only advance team if the question was answered (not just passed)
      if (wasAnswered) {
        advanceToNextTeam();
      }
    }
    setActiveQuestion(null);
  }

  const handleTeamUpdate = (updatedTeam: Team) => {
    setTeams(prev => prev.map(t => t.id === updatedTeam.id ? updatedTeam : t));
    toast({
        title: "Team Updated",
        description: `${updatedTeam.name} has been updated.`,
    })
  };
  
  const advanceToNextTeam = () => {
    setActiveTeamIndex(prev => {
        const currentActiveTeams = teams.filter(t => t.status === 'active');
        if (currentActiveTeams.length === 0) return 0;
        
        const currentTeamId = activeTeams[prev]?.id;
        const currentTeamIndexInActiveList = currentActiveTeams.findIndex(t => t.id === currentTeamId);

        if (currentTeamIndexInActiveList === -1) {
            return 0; // Default to the first active team if current is not found
        }
        
        const nextIndex = (currentTeamIndexInActiveList + 1) % currentActiveTeams.length;
        const nextTeamId = currentActiveTeams[nextIndex].id;
        
        // Find the original index of the next team
        return teams.findIndex(t => t.id === nextTeamId);
    });
  };

  const handleAnswer = (isCorrect: boolean, isPassed: boolean = false) => {
    if (!activeQuestion) return;
    
    const currentTeam = teams[activeTeamIndex];
    if (!currentTeam || currentTeam.status !== 'active') return;

    const points = isCorrect ? (isPassed ? 5 : 10) : 0;
   
    setTeams(prevTeams =>
      prevTeams.map(team =>
        team.id === currentTeam.id
          ? { ...team, score: team.score + points }
          : team
      )
    );

    const newStatus = isCorrect ? 'correct' : 'wrong';
    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === activeQuestion.id
          ? { ...q, status: newStatus }
          : q
      )
    );
    setActiveQuestion(prev => prev ? { ...prev, status: newStatus } : null);
  };
  
  const handlePass = () => {
    if (!activeQuestion) return;
    
    const currentTeamName = teams[activeTeamIndex].name;
    
    // Find the next active team
    const currentActiveTeams = teams.filter(t => t.status === 'active');
    const currentTeamIndexInActiveList = currentActiveTeams.findIndex(t => t.id === teams[activeTeamIndex].id);
    const nextActiveTeamIndex = (currentTeamIndexInActiveList + 1) % currentActiveTeams.length;
    const nextTeam = currentActiveTeams[nextActiveTeamIndex];
    const nextTeamName = nextTeam.name;

    // Find the original index of the next team in the main `teams` array
    const nextTeamOriginalIndex = teams.findIndex(t => t.id === nextTeam.id);

    toast({
        title: 'Passed!',
        description: `Question passed from ${currentTeamName} to ${nextTeamName}.`,
    });
    
    setActiveTeamIndex(nextTeamOriginalIndex);
    // The modal stays open, and the timer will be reset by the key change on the Timer component
  };

 const handleTieBreakerAnswer = (isCorrect: boolean) => {
    if (!tieBreakerState || !activeQuestion) return;

    const currentTeam = teams[activeTeamIndex];

    if (isCorrect) {
      const newSafeTeams = [...tieBreakerState.safeTeams, currentTeam];
      const newTiedTeams = tieBreakerState.tiedTeams.filter(t => t.id !== currentTeam.id);
      
      toast({
        title: "Correct!",
        description: `${currentTeam.name} is safe!`,
      });

      const spotsLeftToFill = tieBreakerState.teamsToAdvance - newSafeTeams.length;

      if (spotsLeftToFill <= 0) {
        // All spots filled, end tie-breaker
        const teamsToEliminateIds = newTiedTeams.map(t => t.id);
        setTeams(prev => prev.map(t => teamsToEliminateIds.includes(t.id) ? { ...t, status: 'eliminated' } : t));
        setGameState('roundover');
        setTieBreakerState(null);
      } else {
        // Still spots left, continue tie-breaker
        setTieBreakerState({
          ...tieBreakerState,
          safeTeams: newSafeTeams,
          tiedTeams: newTiedTeams,
          questionIndex: (tieBreakerState.questionIndex + 1) % tieBreakerQuestions.length,
        });
        advanceToNextTeam();
      }
    } else {
      // Incorrect answer, team is at back of the line
      toast({
        title: "Incorrect!",
        description: `${currentTeam.name} moves to the back of the line.`,
        variant: "destructive",
      });
      setTieBreakerState({
        ...tieBreakerState,
        questionIndex: (tieBreakerState.questionIndex + 1) % tieBreakerQuestions.length,
      });
      advanceToNextTeam();
    }
     setActiveQuestion(null);
  };

  const endRound = React.useCallback(() => {
    const roundInfo = roundDetails[currentRound];
    if (!roundInfo || currentRound > 4) {
      setGameState('roundover');
      return;
    }
    
    const currentActiveTeams = teams.filter(t => t.status === 'active');
    const { teamsAdvancing } = roundInfo;
    const sortedActiveTeams = [...currentActiveTeams].sort((a, b) => b.score - a.score);

    if (sortedActiveTeams.length <= teamsAdvancing) {
        setGameState('roundover');
        return;
    }

    const cutoffScore = sortedActiveTeams[teamsAdvancing -1].score;
    const teamsAboveCutoff = sortedActiveTeams.filter(t => t.score > cutoffScore);
    const teamsAtCutoff = sortedActiveTeams.filter(t => t.score === cutoffScore);
    const spotsLeft = teamsAdvancing - teamsAboveCutoff.length;

    if (teamsAtCutoff.length > spotsLeft) {
      // Manual tie-breaker required
      toast({
          title: `Tie-Breaker Required for Round ${currentRound}!`,
          description: `A tie has occurred involving ${teamsAtCutoff.length} teams for the final ${spotsLeft} advancement spot(s). Please use the Manual Tie Breaker page.`,
          duration: 10000,
          variant: "destructive",
      });
      setGameState('roundover');
    } else {
       const teamsToEliminateIds = sortedActiveTeams.slice(teamsAdvancing).map(t => t.id);
        setTeams(prev =>
            prev.map(t =>
                teamsToEliminateIds.includes(t.id) ? { ...t, status: 'eliminated' } : t
            )
        );
        setGameState('roundover');
    }
  }, [currentRound, teams, toast]);
  
  const proceedToNextStage = () => {
    const activeTeamCount = teams.filter(t => t.status === 'active').length;
    if (currentRound < 4 && activeTeamCount > 1) {
      setCurrentRound(prev => prev + 1);
      setActiveTeamIndex(0);
      setGameState('transition');
    } else {
      setGameState('gameover');
    }
  };

  const handleRoundChange = (newRound: number) => {
    setCurrentRound(newRound);
    setGameState('transition');
    setActiveTeamIndex(0);
  };

  const questionsForRound = questions.filter(q => q.round === currentRound);
  const roundEnded = questionsForRound.every(q => q.status !== 'available');

  React.useEffect(() => {
    if (gameState === 'round' && roundEnded) {
      const timer = setTimeout(() => {
        endRound();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState, roundEnded, endRound]);

  const resetGame = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.location.reload(); // Easiest way to reset all state
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'intro':
        return <IntroScreen onStart={startQuiz} />;
      case 'transition':
        const roundInfo = roundDetails[currentRound];
        const roundTitle = roundInfo?.title || `Round ${currentRound}`;
        const roundRules = roundInfo?.rules || '';
        return (
          <RoundTransition
            roundNumber={currentRound}
            roundTitle={roundTitle}
            rules={roundRules}
            onContinue={startRound}
          />
        );
      case 'roundover':
        return <RoundSummary roundNumber={currentRound} teams={teams} onContinue={proceedToNextStage} />;
      case 'round':
      case 'tie-breaker':
        let teamForQuestion = teams[activeTeamIndex];
        let questionsToShow = questionsForRound;
        
        let titleText = `Round ${currentRound}: ${roundDetails[currentRound]?.title}`;
        let subText = `Up Next: <span class="font-bold text-accent">${teamForQuestion?.name || 'N/A'}</span>`;
        
        if(gameState === 'tie-breaker' && tieBreakerState) {
          questionsToShow = [tieBreakerQuestions[tieBreakerState.questionIndex]];
          titleText = "Sudden Death Tie-Breaker!";
          const spotsLeft = tieBreakerState.teamsToAdvance - tieBreakerState.safeTeams.length;
          subText = `Tied Teams Competing: ${tieBreakerState.tiedTeams.map(t => t.name).join(', ')} | Spots Left: ${spotsLeft}`;
          teamForQuestion = teams[activeTeamIndex];
        }

        return (
          <main className="w-full h-screen p-4 flex flex-col lg:flex-row gap-4">
            <div className="flex-grow flex flex-col gap-4 h-full">
              <div className="text-center lg:pt-12">
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                    <h2 className="text-3xl font-headline text-primary font-bold text-center sm:text-left">{titleText}</h2>
                    <Button variant="outline" size="icon" onClick={() => setIsRulesOpen(true)}>
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View Rules</span>
                    </Button>
                 </div>
                 <p className="text-xl text-muted-foreground mt-2" dangerouslySetInnerHTML={{ __html: subText }} />
              </div>

              <div className="flex-grow flex items-center justify-center">
                <QuestionGrid
                  questions={questionsToShow}
                  onQuestionSelect={handleSelectQuestion}
                />
              </div>

              <div className="flex justify-center items-center flex-wrap gap-4">
                <Button onClick={() => saveState(true)} variant="outline">
                  <Save className="mr-2" /> Save Progress
                </Button>
                <Button onClick={endRound} variant="secondary">
                  <Trophy className="mr-2" /> End Round
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <RotateCcw className="mr-2" /> Reset Game
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will reset the entire game, including all scores and question states. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={resetGame}>Confirm Reset</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <aside className="lg:w-1/3 lg:max-w-sm h-full pt-4 lg:pt-12">
              <Scoreboard teams={teams} onTeamUpdate={handleTeamUpdate} />
            </aside>
          </main>
        );
      case 'gameover':
        return <FinalLeaderboard teams={teams} onReset={resetGame} />;
      default:
        return null;
    }
  };
  
  let teamForModal = teams[activeTeamIndex];
  if (gameState === 'tie-breaker' && tieBreakerState) {
    const tiedTeamIds = tieBreakerState.tiedTeams.map(t => t.id);
    const activeTiedTeams = teams.filter(t => tiedTeamIds.includes(t.id));
    const currentTeam = activeTiedTeams.find(t => t.id === teams[activeTeamIndex].id);
    if (currentTeam) teamForModal = currentTeam;
  }

  return (
    <div className="bg-background min-h-screen text-foreground relative">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Users className="h-4 w-4" />
              <span className="sr-only">View Leaderboard</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] bg-background/90 backdrop-blur-lg">
            <SheetHeader>
              <SheetTitle className="text-2xl font-headline text-primary">Live Scoreboard</SheetTitle>
            </SheetHeader>
            <Scoreboard teams={teams} onTeamUpdate={handleTeamUpdate} />
          </SheetContent>
        </Sheet>
        <Link href="/tie-breaker">
          <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white">
            <Swords className="mr-2 h-4 w-4" />
            Tie Breaker
          </Button>
        </Link>
        <RoundSelector 
          currentRound={currentRound}
          onRoundChange={handleRoundChange}
          isDisabled={!!activeQuestion || gameState === 'intro' || gameState === 'tie-breaker'}
        />
      </div>
      <AnimatePresence mode="wait">
        {renderGameState()}
      </AnimatePresence>
      
      <RulesDialog
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        roundNumber={currentRound}
        rules={roundDetails[currentRound]?.rules || ''}
      />

      <AnimatePresence>
        {activeQuestion && teamForModal && (
        <QuestionModal
          key={`${activeQuestion.id}-${teamForModal.id}`}
          question={activeQuestion}
          teamName={teamForModal.name}
          isOpen={!!activeQuestion}
          onClose={handleModalClose}
          onAnswer={gameState === 'tie-breaker' ? handleTieBreakerAnswer : handleAnswer}
          onPass={handlePass}
          roundNumber={currentRound}
          isTieBreaker={gameState === 'tie-breaker'}
        />
        )}
      </AnimatePresence>
    </div>
  );
}
