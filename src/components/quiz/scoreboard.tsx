import type { Team } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type ScoreboardProps = {
  teams: Team[];
};

const Scoreboard = ({ teams }: ScoreboardProps) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <Card className="bg-transparent backdrop-blur-sm border-none shadow-none sticky top-8 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary flex items-center gap-2">
            <Trophy className="w-7 h-7" />
            Live Scoreboard
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
            <ul className="space-y-3">
            <AnimatePresence>
                {sortedTeams.map((team, index) => (
                <motion.li
                    key={team.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    team.status === 'eliminated'
                        ? 'bg-destructive/20'
                        : 'bg-secondary'
                    }`}
                >
                    <div className="flex items-center gap-3">
                    <span className={`font-bold text-lg ${team.status === 'eliminated' ? 'text-muted-foreground' : 'text-primary'}`}>
                        #{index + 1}
                    </span>
                    <p
                        className={`font-headline text-lg ${
                        team.status === 'eliminated'
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                        }`}
                    >
                        {team.name}
                    </p>
                    </div>
                    <span
                    className={`text-2xl font-bold font-mono ${
                        team.status === 'eliminated'
                        ? 'text-muted-foreground'
                        : 'text-accent'
                    }`}
                    >
                    {team.score}
                    </span>
                </motion.li>
                ))}
            </AnimatePresence>
            </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Scoreboard;
