"use client";

import * as React from 'react';
import type { Team, Question, GameState } from '@/lib/types';
import { initialTeams, allQuestions, roundDetails } from '@/lib/data';
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
    
    setActiveQuestion(null);
    setPassChain([]);
  }

  const handleAnswer = (isCorrect: boolean, answer: string) => {
    if (!activeQuestion) return;

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
    let teamsToEliminate = roundDetails[currentRound]?.teamsEliminated || 0;
    
    if (teamsToEliminate > 0) {
      const sortedTeams = [...teams].filter(t => t.status === 'active').sort((a, b) => a.score - b.score);
      
      const activeTeamCount = activeTeams.length;
      const targetTeamCount = roundDetails[currentRound]?.teamsAdvancing || activeTeamCount;

      if (activeTeamCount > targetTeamCount) {
        teamsToEliminate = activeTeamCount - targetTeamCount;
        const eliminatedTeamIds = sortedTeams.slice(0, teamsToEliminate).map(t => t.id);

        setTeams(prev =>
          prev.map(t =>
            eliminatedTeamIds.includes(t.id) ? { ...t, status: 'eliminated' } : t
          )
        );
      }
    }
    
    setGameState('roundover');
  }, [currentRound, teams, activeTeams.length]);
  
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
      case 'round':
        const activeTeam = activeTeams[activeTeamIndex];
        return (
          <main className="w-[90%] mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 min-h-screen">
            <div className="flex-grow lg:w-2/3">
              <div className="mb-4 text-center">
                 <div className="flex items-center justify-center gap-4">
                    <h2 className="text-3xl font-headline text-primary">Round {currentRound}: {roundDetails[currentRound]?.title}</h2>
                    <Button variant="outline" size="icon" onClick={() => setIsRulesOpen(true)}>
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View Rules</span>
                    </Button>
                 </div>
                 <p className="text-xl text-muted-foreground mt-2">Up Next: <span className="font-bold text-accent">{activeTeam?.name || 'N/A'}</span></p>
              </div>
              <QuestionGrid
                questions={questionsForRound}
                onQuestionSelect={handleSelectQuestion}
              />
            </div>
            <aside className="lg:w-1/3">
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
          question={activeQuestion}
          teamName={activeTeams[activeTeamIndex]?.name || "Team"}
          isOpen={!!activeQuestion}
          onClose={handleModalClose}
          onAnswer={handleAnswer}
          onPass={handlePass}
          roundNumber={currentRound}
        />
        )}
      </AnimatePresence>

      {gameState !== 'intro' && gameState !== 'gameover' && (
        <div className="flex justify-center items-center gap-4 my-8">
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
      )}
    </div>
  );
}
