
"use client";

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Team, Question, TieBreakerState } from '@/lib/types';
import { initialTeams, manualTieBreakerQuestions, roundDetails, allQuestions as allGameQuestions } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, RefreshCw, Trophy, FileQuestion } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'quizGameState';

export default function TieBreakerPage() {
  const [teams, setTeams] = React.useState<Team[]>(initialTeams);
  const [questions, setQuestions] = React.useState<Question[]>(allGameQuestions);
  const [tieBreakerState, setTieBreakerState] = React.useState<TieBreakerState>({
    round: null,
    tiedTeams: [],
    selectedTeams: [],
    question: null,
  });
  const [showAnswer, setShowAnswer] = React.useState(false);
  const [showQuestionCard, setShowQuestionCard] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        setTeams(savedState.teams || initialTeams);
        setQuestions(savedState.questions || allGameQuestions);
      }
    } catch (error) {
      console.error("Failed to load state from local storage", error);
    }
  }, []);

  const getTieBreakerQuestionsForRound = (roundNumber: number) => {
    if (roundNumber === 1) {
      return manualTieBreakerQuestions;
    }
    // For rounds 2, 3, 4, use unused questions from the main game
    return questions.filter(q => q.round === roundNumber && q.status === 'available');
  };

  const handleRoundSelect = (roundNumber: number) => {
    const roundInfo = roundDetails[roundNumber];
    if (!roundInfo) return;
    
    setShowAnswer(false);
    setShowQuestionCard(false);

    const activeTeams = teams.filter(t => t.status === 'active');
    const sortedActiveTeams = [...activeTeams].sort((a, b) => b.score - a.score);
    
    let teamsAtCutoff: Team[] = [];

    if (roundNumber === 4) {
      // Final round tie logic: Check for a tie for 1st place
      if (sortedActiveTeams.length > 1 && sortedActiveTeams[0].score === sortedActiveTeams[1].score) {
        const topScore = sortedActiveTeams[0].score;
        teamsAtCutoff = sortedActiveTeams.filter(t => t.score === topScore);
      }
    } else {
      // Elimination round tie logic
      const { teamsAdvancing } = roundInfo;
      if (activeTeams.length <= teamsAdvancing) {
          toast({ title: `No tie detected for Round ${roundNumber}`, description: "Not enough teams for an elimination tie." });
          setTieBreakerState({ round: roundNumber, tiedTeams: [], selectedTeams: [], question: null });
          return;
      }
      const cutoffScore = sortedActiveTeams[teamsAdvancing - 1].score;
      const teamsAboveCutoff = sortedActiveTeams.filter(t => t.score > cutoffScore);
      if (teamsAboveCutoff.length < teamsAdvancing) {
        teamsAtCutoff = sortedActiveTeams.filter(t => t.score === cutoffScore);
      }
    }

    const tieBreakerQuestions = getTieBreakerQuestionsForRound(roundNumber);
    
    if (teamsAtCutoff.length > 1) {
        if (tieBreakerQuestions.length === 0) {
            toast({ title: "No Tie-Breaker Questions", description: `There are no unused questions available for Round ${roundNumber}.`, variant: "destructive" });
             setTieBreakerState({ round: roundNumber, tiedTeams: teamsAtCutoff, selectedTeams: [], question: null });
             return;
        }
        setTieBreakerState({
            round: roundNumber,
            tiedTeams: teamsAtCutoff,
            selectedTeams: [],
            question: tieBreakerQuestions[0]
        });
    } else {
        toast({ title: `No tie detected for Round ${roundNumber}`, description: "All advancement spots are clearly decided." });
        setTieBreakerState({ round: roundNumber, tiedTeams: [], selectedTeams: [], question: null });
    }
  };

  const handleTeamSelection = (teamId: number) => {
    setShowQuestionCard(false); // Hide question card when team selection changes
    setTieBreakerState(prev => {
        const isSelected = prev.selectedTeams.some(t => t.id === teamId);
        const team = prev.tiedTeams.find(t => t.id === teamId);
        if (!team) return prev;

        const newSelectedTeams = isSelected
            ? prev.selectedTeams.filter(t => t.id !== teamId)
            : [...prev.selectedTeams, team];
        
        return { ...prev, selectedTeams: newSelectedTeams };
    });
  };

  const handleAwardPoints = (winnerTeamId: number) => {
    const updatedTeams = teams.map(t => 
        t.id === winnerTeamId ? { ...t, score: t.score + 10 } : t
    );
    setTeams(updatedTeams);

    try {
        const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
        const savedState = savedStateJSON ? JSON.parse(savedStateJSON) : {};
        const stateToSave = { ...savedState, teams: updatedTeams };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
        toast({
            title: "Tie Broken!",
            description: `${teams.find(t => t.id === winnerTeamId)?.name} awarded 10 points.`,
        });

        // Re-evaluate the tie with new scores
        handleRoundSelect(tieBreakerState.round!);

    } catch (error) {
        console.error("Failed to save state", error);
        toast({ title: "Error saving state", variant: "destructive" });
    }
  };
  
  const nextQuestion = () => {
    setTieBreakerState(prev => {
        if (!prev.question || !prev.round) return prev;
        const tieBreakerQuestionsForRound = getTieBreakerQuestionsForRound(prev.round);
        if(tieBreakerQuestionsForRound.length === 0) return prev;
        const currentIndex = tieBreakerQuestionsForRound.findIndex(q => q.id === prev.question!.id);
        const nextIndex = (currentIndex + 1) % tieBreakerQuestionsForRound.length;
        return { ...prev, question: tieBreakerQuestionsForRound[nextIndex] };
    })
    setShowAnswer(false);
  }

  const renderQuestionDisplay = () => {
    if (!tieBreakerState.question) return null;

    const { question } = tieBreakerState;

    if (question.type === 'logo') {
      return (
        <div className="flex justify-center mb-4">
          <Image
            data-ai-hint="logo company"
            src={question.content}
            alt="Brand Logo for tie-breaker"
            width={300}
            height={200}
            className="rounded-lg bg-white p-2 shadow-md"
          />
        </div>
      );
    }
    
    return (
      <div className="p-4 border rounded-lg bg-background mb-4">
        <p className="text-lg font-semibold">{question.content}</p>
        {question.options && (
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
            {question.options.map((opt, i) => <span key={i}>{opt}</span>)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-5xl">
        <Link href="/" className="inline-flex items-center mb-4 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Main Game
        </Link>
        <h1 className="text-4xl sm:text-5xl font-headline font-bold text-primary mb-2">Tie Breaker Control Room</h1>
        <p className="text-muted-foreground mb-8">Manually resolve ties for any round.</p>
        
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>1. Select a Round to Check for Ties</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
                {Object.keys(roundDetails).map(r => Number(r)).filter(num => num <=4).map(roundNum => (
                    <Button key={roundNum} variant={tieBreakerState.round === roundNum ? "default" : "outline"} onClick={() => handleRoundSelect(roundNum)}>
                        Round {roundNum}: {roundDetails[roundNum].title}
                    </Button>
                ))}
            </CardContent>
        </Card>
        
        {tieBreakerState.round !== null && (
            <>
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>2. Select Teams for Rapid Fire</CardTitle>
                        {tieBreakerState.tiedTeams.length > 0 ? (
                             <p className="text-muted-foreground pt-1">{tieBreakerState.tiedTeams.length} teams are tied.</p>
                        ) : (
                            <p className="text-muted-foreground pt-1">No teams are currently tied for this round.</p>
                        )}
                       
                    </CardHeader>
                    {tieBreakerState.tiedTeams.length > 0 && (
                        <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {tieBreakerState.tiedTeams.map(team => (
                                <div key={team.id} className="flex items-center space-x-2 p-3 bg-secondary rounded-md">
                                    <Checkbox
                                        id={`team-${team.id}`}
                                        checked={tieBreakerState.selectedTeams.some(t => t.id === team.id)}
                                        onCheckedChange={() => handleTeamSelection(team.id)}
                                    />
                                    <Label htmlFor={`team-${team.id}`} className="text-base font-medium leading-none cursor-pointer">
                                        {team.name} ({team.score} pts)
                                    </Label>
                                </div>
                            ))}
                        </CardContent>
                    )}
                </Card>

                {tieBreakerState.selectedTeams.length > 0 && tieBreakerState.question && (
                     <>
                        {!showQuestionCard && (
                            <div className="text-center mb-8">
                                <Button size="lg" onClick={() => setShowQuestionCard(true)}>
                                    <FileQuestion className="mr-2 h-5 w-5" />
                                    Show Question
                                </Button>
                            </div>
                        )}
                        {showQuestionCard && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex justify-between items-center">
                                        <span>3. Ask Question & Award Points</span>
                                        <Button variant="outline" size="sm" onClick={nextQuestion}>
                                            <RefreshCw className="mr-2 h-4 w-4"/>
                                            Next Question
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {renderQuestionDisplay()}
                                    <div className="text-center mb-4">
                                        {showAnswer ? (
                                            <p className="text-green-500 font-bold text-lg">Answer: {tieBreakerState.question.answer}</p>
                                        ) : (
                                            <Button variant="secondary" onClick={() => setShowAnswer(true)}>Show Answer</Button>
                                        )}
                                    </div>
                                    <p className="text-center text-muted-foreground mb-4">Click the team that answered correctly first to award them +10 points.</p>
                                    <div className="flex flex-wrap justify-center gap-3">
                                        {tieBreakerState.selectedTeams.map(team => (
                                            <Button key={team.id} size="lg" onClick={() => handleAwardPoints(team.id)} disabled={!showAnswer}>
                                                <Trophy className="mr-2 h-4 w-4" />
                                                Award to {team.name}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                     </>
                )}
            </>
        )}
      </div>
    </div>
  );
}

    