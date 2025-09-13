"use client";

import * as React from 'react';
import type { Team, Question, GameState } from '@/lib/types';
import { initialTeams, allQuestions, roundDetails, tieBreakerQuestion } from '@/lib/data';
import { AnimatePresence } from 'framer-motion';
import { FileText, Users, Save, RotateCcw } from 'lucide-react';

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
  const [passChain, setPassChain] = React.useState<number[]>([]);
  const [isRulesOpen, setIsRulesOpen] = React.useState(false);
  const [tiedTeams, setTiedTeams] = React.useState<Team[]>([]);
  const [tieBreakerIndex, setTieBreakerIndex] = React.useState(0);
  const { toast } = useToast();

  const activeTeams = teams.filter(t => t.status === 'active');
  
  // Load state from local storage on initial render
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

  const saveState = () => {
    try {
      const stateToSave = {
        gameState,
        currentRound,
        teams,
        questions,
        activeTeamIndex,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
      toast({
        title: "Progress Saved",
        description: "Your game progress has been saved successfully.",
      });
    } catch (error) {
       console.error("Failed to save state to local storage", error);
       toast({
        title: "Save Error",
        description: "Could not save your game progress.",
        variant: "destructive",
      });
    }
  };

  // Auto-save state whenever it changes
  React.useEffect(() => {
    // We don't save in intro state to avoid overwriting a saved game before it's loaded
    if (gameState !== 'intro') {
      const stateToSave = {
        gameState,
        currentRound,
        teams,
        questions,
        activeTeamIndex,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    }
  }, [gameState, currentRound, teams, questions, activeTeamIndex]);

  const startQuiz = () => {
    setGameState('transition');
  };

  const startRound = () => {
    setGameState('round');
    setPassChain([]);
    setTieBreakerIndex(0);
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
    setActiveQuestion(question);
    setPassChain([activeTeamIndex]);
  };

  const advanceToNextTeam = () => {
    setActiveTeamIndex(prev => (prev + 1) % activeTeams.length);
  };
  
  const endTieBreaker = (finalTeamsState: Team[]) => {
      // Find who was eliminated
      const eliminatedInTieBreaker = tiedTeams.filter(tiedTeam => 
        !finalTeamsState.find(t => t.id === tiedTeam.id && t.status === 'active')
      );

      toast({
          title: "Tie-Breaker Over!",
          description: `${eliminatedInTieBreaker.map(t => t.name).join(', ')} have been eliminated.`,
          duration: 5000,
      });

      setGameState('roundover');
  };
  
  const handleModalClose = () => {
    if (!activeQuestion) return;

    if (activeQuestion.status !== 'available') {
        const isCorrect = activeQuestion.status === 'correct';
        const isPassed = passChain.length > 1;

        if (!isPassed || !isCorrect) {
            if (!isPassed) {
                advanceToNextTeam();
            }
        }
    }
    
    if (gameState === 'tie-breaker') {
        const nonTiedActiveTeamsCount = teams.filter(t => t.status === 'active' && !tiedTeams.some(tied => tied.id === t.id)).length;
        const spotsLeft = roundDetails[currentRound].teamsAdvancing - nonTiedActiveTeamsCount;
        
        const teamsThatSurvivedTie = teams.filter(t => t.status === 'active' && tiedTeams.some(tied => tied.id === t.id));
        const teamsEliminatedInTie = tiedTeams.length - teamsThatSurvivedTie.length;

        const tiedTeamsRemainingToPlay = tiedTeams.length - tieBreakerIndex - 1;

        if (teamsThatSurvivedTie.length === spotsLeft) {
            // All spots are filled. Eliminate the rest.
            const teamsToEliminate = tiedTeams.filter(tt => !teamsThatSurvivedTie.some(survivor => survivor.id === tt.id));
            const finalTeams = teams.map(t => teamsToEliminate.some(elim => elim.id === t.id) ? { ...t, status: 'eliminated' } : t);
            setTeams(finalTeams);
            endTieBreaker(finalTeams);

        } else if (tiedTeamsRemainingToPlay === (spotsLeft - teamsThatSurvivedTie.length)) {
             // The rest of the teams automatically qualify as there are enough spots.
            const teamsToEliminateCount = tiedTeams.length - spotsLeft;
            const eliminatedCount = teamsEliminatedInTie;

            if(eliminatedCount === teamsToEliminateCount) {
                endTieBreaker(teams);
            } else {
                 setTieBreakerIndex(prev => prev + 1);
            }
        } else {
            setTieBreakerIndex(prev => prev + 1);
        }
    }

    setActiveQuestion(null);
    setPassChain([]);
  }

  const handleAnswer = (isCorrect: boolean, answer: string) => {
    if (!activeQuestion) return;

    if (gameState === 'tie-breaker') {
        const currentTiedTeam = tiedTeams[tieBreakerIndex];
        
        toast({
            title: `Tie-Breaker: ${currentTiedTeam.name}`,
            description: isCorrect ? 'Answered correctly!' : 'Answered incorrectly and is ELIMINATED!'
        });
        
        if (!isCorrect) {
            // Eliminate the team that answered incorrectly
            setTeams(prev => prev.map(t => t.id === currentTiedTeam.id ? { ...t, status: 'eliminated' } : t));
        }

        // We use a temporary status on the activeQuestion to show correct/incorrect in the modal
        // This status isn't saved to the main questions array.
        setActiveQuestion(prev => prev ? { ...prev, status: isCorrect ? 'correct' : 'wrong' } : null);
        return;
    }

    const currentTeam = activeTeams[activeTeamIndex];
    const isPassed = passChain.length > 1;
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

    const nextTeamIndexInChain = (activeTeamIndex + 1) % activeTeams.length;

    if (passChain.includes(nextTeamIndexInChain)) {
      setQuestions(prev => prev.map(q => q.id === activeQuestion.id ? { ...q, status: 'wrong' } : q));
      setActiveQuestion(prev => prev ? { ...prev, status: 'wrong' } : null);
      toast({
        title: 'Question Passed Out',
        description: `No team could answer correctly.`,
        variant: 'destructive'
      });
    } else {
      setActiveTeamIndex(nextTeamIndexInChain);
      setPassChain(prev => [...prev, nextTeamIndexInChain]);
      toast({
        title: 'Passed!',
        description: `Question passed to ${activeTeams[nextTeamIndexInChain].name}.`,
      });
    }
  };


  const endRound = React.useCallback(() => {
    const teamsAdvancing = roundDetails[currentRound]?.teamsAdvancing;
    if (teamsAdvancing === undefined || activeTeams.length <= teamsAdvancing) {
        setGameState('roundover');
        return;
    }

    const sortedActiveTeams = [...activeTeams].sort((a, b) => b.score - a.score);
    const scoreToBeat = sortedActiveTeams[teamsAdvancing - 1].score;
    const teamsBelowCutoff = sortedActiveTeams.filter(t => t.score < scoreToBeat);
    const teamsOnBubble = sortedActiveTeams.filter(t => t.score === scoreToBeat);

    const safeTeamsCount = sortedActiveTeams.length - teamsBelowCutoff.length - teamsOnBubble.length;
    const spotsLeft = teamsAdvancing - safeTeamsCount;
    
    if (teamsOnBubble.length > spotsLeft) {
         // Tie-breaker needed
        toast({
            title: "Tie-Breaker!",
            description: `${teamsOnBubble.length} teams tied for the final ${spotsLeft} spots. Sudden death!`,
            duration: 5000,
        });
        
        const teamsToEliminate = teamsBelowCutoff.map(t => t.id);
        if (teamsToEliminate.length > 0) {
            setTeams(prev => prev.map(t => teamsToEliminate.includes(t.id) ? { ...t, status: 'eliminated' } : t));
        }

        setTiedTeams(teamsOnBubble.sort((a,b) => a.id - b.id)); // Sort by ID for consistent order
        setTieBreakerIndex(0);
        setGameState('tie-breaker');
        return;
    } else {
        const teamsToEliminate = teamsBelowCutoff.map(t => t.id);
        setTeams(prev =>
            prev.map(t =>
                teamsToEliminate.includes(t.id) ? { ...t, status: 'eliminated' } : t
            )
        );
        setGameState('roundover');
    }
  }, [currentRound, teams, activeTeams]);
  
  const proceedToNextStage = () => {
    const activeTeamCount = teams.filter(t => t.status === 'active').length;
    if (currentRound < Object.keys(roundDetails).length && activeTeamCount > 1) {
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
    setPassChain([]);
    // Do not reset teams or questions to preserve scores and question states across rounds
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

  React.useEffect(() => {
    if (gameState === 'tie-breaker' && tiedTeams.length > 0 && tieBreakerIndex < tiedTeams.length) {
        // A new tie-breaker question needs to be shown
        setActiveQuestion({ ...tieBreakerQuestion, id: Date.now(), status: 'available' }); // Use new ID to force re-render
    }
  }, [gameState, tiedTeams, tieBreakerIndex]);

  const resetGame = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setGameState('intro');
    setCurrentRound(1);
    setTeams(initialTeams);
setQuestions(allQuestions);
    setActiveQuestion(null);
    setActiveTeamIndex(0);
    setPassChain([]);
  };

  const renderGameState = () => {
    switch (gameState) {
      case 'intro':
        return <IntroScreen onStart={startQuiz} />;
      case 'transition':
        return (
          <RoundTransition
            roundNumber={currentRound}
            roundTitle={roundDetails[currentRound]?.title || ''}
            rules={roundDetails[currentRound]?.rules || ''}
            onContinue={startRound}
          />
        );
      case 'roundover':
        return <RoundSummary roundNumber={currentRound} teams={teams} onContinue={proceedToNextStage} />;
      case 'tie-breaker': // This state uses the 'round' view but is handled differently
      case 'round':
        let teamForQuestion;
        if (gameState === 'tie-breaker') {
            teamForQuestion = tiedTeams[tieBreakerIndex];
        } else {
            teamForQuestion = activeTeams[activeTeamIndex];
        }

        return (
          <main className="w-full h-screen p-4 flex flex-col lg:flex-row gap-4">
            <div className="flex-grow flex flex-col gap-4 h-full">
               <div className="text-center">
                 <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                    <h2 className="text-3xl font-headline text-primary text-center sm:text-left">Round {currentRound}: {roundDetails[currentRound]?.title}</h2>
                    <Button variant="outline" size="icon" onClick={() => setIsRulesOpen(true)}>
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View Rules</span>
                    </Button>
                 </div>
                 <p className="text-xl text-muted-foreground mt-2">Up Next: <span className="font-bold text-accent">{teamForQuestion?.name || 'N/A'}</span></p>
              </div>
              <div className="flex-grow flex items-center justify-center">
                <QuestionGrid
                  questions={questionsForRound}
                  onQuestionSelect={handleSelectQuestion}
                />
              </div>
              <div className="flex justify-center items-center gap-4">
                <Button onClick={saveState} variant="outline" className="bg-card/70 backdrop-blur-sm">
                  <Save className="mr-2" /> Save Progress
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
            <aside className="lg:w-1/3 lg:max-w-sm h-full lg:pt-12">
              <Scoreboard teams={teams} />
            </aside>
          </main>
        );
      case 'gameover':
        return <FinalLeaderboard teams={teams} onReset={resetGame} />;
      default:
        return null;
    }
  };
  
  let teamForModal;
  if (gameState === 'tie-breaker') {
    teamForModal = tiedTeams[tieBreakerIndex];
  } else {
    teamForModal = activeTeams[activeTeamIndex];
  }

  return (
    <div className="bg-background min-h-screen text-foreground relative">
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-card/70 backdrop-blur-sm">
              <Users className="h-4 w-4" />
              <span className="sr-only">View Leaderboard</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] bg-background/90 backdrop-blur-lg border-primary/30">
            <SheetHeader>
              <SheetTitle className="text-2xl font-headline text-primary">Live Scoreboard</SheetTitle>
            </SheetHeader>
            <Scoreboard teams={teams} />
          </SheetContent>
        </Sheet>
        <RoundSelector 
          currentRound={currentRound}
          onRoundChange={handleRoundChange}
          isDisabled={!!activeQuestion || gameState === 'intro'}
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
        {activeQuestion && (
        <QuestionModal
          key={activeQuestion.id}
          question={activeQuestion}
          teamName={teamForModal?.name || "Team"}
          isOpen={!!activeQuestion}
          onClose={handleModalClose}
          onAnswer={handleAnswer}
          onPass={handlePass}
          roundNumber={currentRound}
          isTieBreaker={gameState === 'tie-breaker'}
        />
        )}
      </AnimatePresence>
    </div>
  );
}
