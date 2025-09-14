"use client";

import * as React from 'react';
import Link from 'next/link';
import type { Team, Question, GameState, TieBreakerState } from '@/lib/types';
import { initialTeams, allQuestions, roundDetails } from '@/lib/data';
import { AnimatePresence } from 'framer-motion';
import { FileText, Users, Save, RotateCcw, Swords } from 'lucide-react';

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

  const saveState = React.useCallback(() => {
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
  }, [gameState, currentRound, teams, questions, activeTeamIndex, toast]);

  React.useEffect(() => {
    if (gameState !== 'intro') {
      saveState();
    }
  }, [gameState, currentRound, teams, questions, activeTeamIndex, saveState]);

  const startQuiz = () => {
    setGameState('transition');
  };

  const startRound = () => {
    setGameState('round');
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
  };
  
  const handleModalClose = () => {
    if (!activeQuestion) return;
    
    // Only advance team if the question was answered (not just passed)
    if (activeQuestion.status !== 'available') {
       advanceToNextTeam();
    }
    setActiveQuestion(null);
  }
  
  const advanceToNextTeam = () => {
    setActiveTeamIndex(prev => (prev + 1) % activeTeams.length);
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!activeQuestion) return;

    const currentTeam = activeTeams[activeTeamIndex];
    const points = isCorrect ? 10 : 0;
   
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
  
  // This is now a simple pass, no complex chain logic
  const handlePass = () => {
    if (!activeQuestion) return;
    
    // Mark question as "wrong" to prevent re-selection
    setQuestions(prev => prev.map(q => q.id === activeQuestion.id ? { ...q, status: 'wrong' } : q));
    
    toast({
        title: 'Passed!',
        description: `Question passed by ${activeTeams[activeTeamIndex].name}. Moving to next team.`,
    });
    
    // Close modal and advance to next team
    setActiveQuestion(null);
    advanceToNextTeam();
  };

  const endRound = React.useCallback(() => {
    const roundInfo = roundDetails[currentRound];
    if (!roundInfo || currentRound > 4) {
      setGameState('roundover');
      return;
    }
    
    const { teamsAdvancing } = roundInfo;
    const sortedActiveTeams = [...activeTeams].sort((a, b) => b.score - a.score);

    if (activeTeams.length <= teamsAdvancing) {
        setGameState('roundover');
        return;
    }

    const cutoffScore = sortedActiveTeams[teamsAdvancing - 1].score;
    const teamsAtCutoff = sortedActiveTeams.filter(t => t.score === cutoffScore);
    const teamsAboveCutoff = sortedActiveTeams.filter(t => t.score > cutoffScore);

    if (teamsAboveCutoff.length + teamsAtCutoff.length > teamsAdvancing) {
        toast({
            title: `Tie-Breaker Required for Round ${currentRound}!`,
            description: `A tie has occurred for the final advancement spots. Please navigate to the Tie-Breaker page to resolve it manually.`,
            duration: 10000,
            variant: "destructive",
        });
        setGameState('roundover');
        return;
    }

    const teamsToEliminateIds = sortedActiveTeams.slice(teamsAdvancing).map(t => t.id);
    
    setTeams(prev =>
        prev.map(t =>
            teamsToEliminateIds.includes(t.id) ? { ...t, status: 'eliminated' } : t
        )
    );
    setGameState('roundover');
  }, [currentRound, activeTeams, toast]);
  
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
      case 'round':
        const teamForQuestion = activeTeams[activeTeamIndex];
        return (
          <main className="w-full h-screen p-4 flex flex-col lg:flex-row gap-4">
            <div className="flex-grow flex flex-col gap-4 h-full">
              <div className="text-center lg:pt-12">
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
  
  const teamForModal = activeTeams[activeTeamIndex];

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
        <Link href="/tie-breaker">
          <Button variant="destructive" className="bg-card/70 backdrop-blur-sm">
            <Swords className="mr-2 h-4 w-4" />
            Tie Breaker
          </Button>
        </Link>
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
        />
        )}
      </AnimatePresence>
    </div>
  );
}
