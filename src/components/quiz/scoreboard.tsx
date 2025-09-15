import type { Team } from '@/lib/types';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, Edit } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

type ScoreboardProps = {
  teams: Team[];
  onTeamUpdate: (team: Team) => void;
};

const TeamEditor = ({ team, onTeamUpdate }: { team: Team, onTeamUpdate: (team: Team) => void }) => {
    const [name, setName] = React.useState(team.name);
    const [isActive, setIsActive] = React.useState(team.status === 'active');
    
    const handleSave = () => {
        onTeamUpdate({
            ...team,
            name,
            status: isActive ? 'active' : 'eliminated',
        });
    };

    return (
        <div className="grid gap-4">
            <div className="space-y-2">
                <h4 className="font-medium leading-none">Edit Team</h4>
                <p className="text-sm text-muted-foreground">
                    Rename team or change their status.
                </p>
            </div>
            <div className="grid gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-2 h-8" />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="status">Active</Label>
                    <Switch id="status" checked={isActive} onCheckedChange={setIsActive} />
                </div>
                <Button onClick={handleSave} size="sm">Save</Button>
            </div>
        </div>
    )
}

const Scoreboard = ({ teams, onTeamUpdate }: ScoreboardProps) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  return (
    <Card className="bg-transparent border-none shadow-none h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary flex items-center gap-2">
            <Trophy className="w-7 h-7" />
            Live Scoreboard
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow h-0">
        <ScrollArea className="h-full pr-4">
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
                    className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    team.status === 'eliminated'
                        ? 'bg-destructive/10'
                        : 'bg-card shadow-subtle border'
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
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-accent-foreground">
                                <Edit className="w-4 h-4"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                           <TeamEditor team={team} onTeamUpdate={onTeamUpdate} />
                        </PopoverContent>
                    </Popover>
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
