
"use client";

import * as React from 'react';
import Link from 'next/link';
import type { Team, Question, TieBreakerState } from '@/lib/types';
import { initialTeams, allQuestions, roundDetails, tieBreakerQuestions } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, RefreshCw, Trophy } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'quizGameState';

export default function TieBreakerPage() {
  const [teams, setTeams] = React.useState<Team[]>(initialTeams);
  const [tieBreakerState, setTieBreakerState] = React.useState<TieBreakerState>({
    round: null,
    tiedTeams: [],
    selectedTeams: [],
    question: null,
  });
  const { toast } = useToast();

  React.useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        setTeams(savedState.teams || initialTeams);
      }
    } catch (error) {
      console.error("Failed to load state from local storage", error);
    }
  }, []);

  const handleRoundSelect = (roundNumber: number) => {
    const roundInfo = roundDetails[roundNumber];
    if (!roundInfo) return;

    const activeTeams = teams.filter(t => t.status === 'active');
    const sortedActiveTeams = [...activeTeams].sort((a, b) => b.score - a.score);
    
    if (activeTeams.length <= roundInfo.teamsAdvancing) {
        toast({ title: `No tie detected for Round ${roundNumber}`, description: "Not enough teams for an elimination tie." });
        setTieBreakerState({ round: roundNumber, tiedTeams: [], selectedTeams: [], question: null });
        return;
    }

    const cutoffScore = sortedActiveTeams[roundInfo.teamsAdvancing - 1].score;
    const teamsAtCutoff = sortedActiveTeams.filter(t => t.score === cutoffScore);
    const teamsAboveCutoff = sortedActiveTeams.filter(t => t.score > cutoffScore);

    if (teamsAboveCutoff.length + teamsAtCutoff.length > roundInfo.teamsAdvancing) {
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
        if (!prev.question) return prev;
        const currentIndex = tieBreakerQuestions.findIndex(q => q.id === prev.question!.id);
        const nextIndex = (currentIndex + 1) % tieBreakerQuestions.length;
        return { ...prev, question: tieBreakerQuestions[nextIndex] };
    })
  }

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
                {Object.keys(roundDetails).map(r => Number(r)).map(roundNum => (
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
                             <p className="text-muted-foreground pt-1">{tieBreakerState.tiedTeams.length} teams are tied for elimination spots.</p>
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
                            <div className="p-4 border rounded-lg bg-background mb-4">
                                <p className="text-lg font-semibold">{tieBreakerState.question.content}</p>
                                {tieBreakerState.question.options && (
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                                        {tieBreakerState.question.options.map((opt, i) => <span key={i}>{opt}</span>)}
                                    </div>
                                )}
                                <p className="text-right text-green-500 font-bold mt-2">Answer: {tieBreakerState.question.answer}</p>
                            </div>
                            <p className="text-center text-muted-foreground mb-4">Click the team that answered correctly first to award them +10 points.</p>
                            <div className="flex flex-wrap justify-center gap-3">
                                {tieBreakerState.selectedTeams.map(team => (
                                    <Button key={team.id} size="lg" onClick={() => handleAwardPoints(team.id)}>
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
      </div>
    </div>
  );
}
