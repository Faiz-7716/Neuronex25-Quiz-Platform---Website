import type { Team } from '@/lib/types';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Crown, Medal, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type FinalLeaderboardProps = {
  teams: Team[];
  onReset: () => void;
};

const podiumIcons = [
  <Crown key="1" className="w-12 h-12 text-yellow-400" />,
  <Medal key="2" className="w-10 h-10 text-gray-400" />,
  <Award key="3" className="w-9 h-9 text-orange-400" />,
];

const podiumColors = [
  'border-yellow-400 bg-yellow-400/10',
  'border-gray-400 bg-gray-400/10',
  'border-orange-400 bg-orange-400/10',
];

const FinalLeaderboard = ({ teams, onReset }: FinalLeaderboardProps) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const topTeams = sortedTeams.slice(0, 3);
  const otherTeams = sortedTeams.slice(3);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen text-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-6xl font-headline font-bold text-primary mb-12">Final Results</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 w-full max-w-4xl">
        {topTeams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 * (index + 1) }}
          >
            <Card className={`border-2 ${podiumColors[index]}`}>
              <CardHeader className="items-center">
                {podiumIcons[index]}
                <CardTitle className="font-headline text-3xl mt-2">{team.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-5xl font-bold font-mono text-accent">{team.score}</p>
                <p className="text-muted-foreground text-lg">
                  {['Winner', 'Runner-up', 'Third Place'][index]}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {otherTeams.length > 0 && (
         <div className="w-full max-w-2xl mb-12">
            <h3 className="text-2xl font-headline text-muted-foreground mb-4">Other Participants</h3>
            <Card>
              <CardContent className="p-4">
                <ul className="space-y-2">
                    {otherTeams.map((team, index) => (
                        <li key={team.id} className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg">
                            <span className="font-headline text-lg">#{index + 4} {team.name}</span>
                            <span className="font-mono text-lg font-bold">{team.score} pts</span>
                        </li>
                    ))}
                </ul>
              </CardContent>
            </Card>
         </div>
      )}

      <Button onClick={onReset} size="lg" className="font-headline text-lg">
        Play Again
      </Button>
    </motion.div>
  );
};

export default FinalLeaderboard;
