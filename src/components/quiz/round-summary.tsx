import type { Team } from '@/lib/types';
import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

type RoundSummaryProps = {
  roundNumber: number;
  teams: Team[];
  onContinue: () => void;
};

const RoundSummary = ({ roundNumber, teams, onContinue }: RoundSummaryProps) => {
  const sortedTeams = [...teams]
    .filter(t => t.status === 'active' || t.status === 'eliminated')
    .sort((a, b) => b.score - a.score);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-5xl font-headline font-bold text-primary mb-4">
        Round {roundNumber} Complete
      </h1>
      <p className="text-xl text-muted-foreground mb-12">
        Here are the current standings...
      </p>

      <div className="w-full max-w-2xl">
        <Card className="bg-card/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary flex items-center gap-2">
              <Trophy /> Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {sortedTeams.map((team, index) => {
                const isEliminated = team.status === 'eliminated';
                return (
                  <li
                    key={team.id}
                    className="flex justify-between items-center p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                        <span 
                            className={`font-bold text-xl w-8 h-8 flex items-center justify-center rounded-full ${
                                isEliminated ? 'bg-red-500 text-white' : 'bg-primary text-primary-foreground'
                            }`}
                        >
                            {index + 1}
                        </span>
                        <span className={`font-headline text-xl ${isEliminated ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {team.name}
                        </span>
                    </div>
                    <div 
                        className={`font-mono text-xl font-bold p-2 rounded-md ${
                            isEliminated ? 'text-red-500' : 'text-accent'
                        }`}
                    >
                        {team.score} pts
                    </div>
                  </li>
                )
            })}
            </ul>
          </CardContent>
        </Card>
      </div>


      <Button onClick={onContinue} size="lg" className="font-headline text-lg mt-12">
          {roundNumber < 4 ? `Start Round ${roundNumber + 1}` : 'View Final Results'}
      </Button>
    </motion.div>
  );
};

export default RoundSummary;
