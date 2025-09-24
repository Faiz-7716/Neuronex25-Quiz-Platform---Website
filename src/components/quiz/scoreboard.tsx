import type { Team } from '@/lib/types';
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, Edit, Plus, Minus } from 'lucide-react';
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

const TeamEditor = ({ team, onTeamUpdate, closePopover }: { team: Team, onTeamUpdate: (team: Team) => void, closePopover: () => void }) => {
    const [name, setName] = React.useState(team.name);
    const [score, setScore] = React.useState(team.score);
    const [isActive, setIsActive] = React.useState(team.status === 'active');
    
    const handleSave = () => {
        onTeamUpdate({
            ...team,
            name,
            score,
            status: isActive ? 'active' : 'eliminated',
        });
        closePopover();
    };

    return (
        <div className="grid gap-4">
            <div className="space-y-2">
                <h4 className="font-medium leading-none">Edit Team</h4>
                <p className="text-sm text-muted-foreground">
                    Manually adjust team details.
                </p>
            </div>
            <div className="grid gap-4">
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-2 h-8" />
                </div>
                 <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="score">Score</Label>
                    <div className="col-span-2 flex items-center gap-2">
                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setScore(s => s - 1)}><Minus className="h-4 w-4" /></Button>
                         <Input id="score" type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} className="h-8 w-16 text-center" />
                         <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setScore(s => s + 1)}><Plus className="h-4 w-4" /></Button>
                    </div>
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="status">Active</Label>
                    <Switch id="status" checked={isActive} onCheckedChange={setIsActive} />
                </div>
                <Button onClick={handleSave} size="sm">Save Changes</Button>
            </div>
        </div>
    )
}

const Scoreboard = ({ teams, onTeamUpdate }: ScoreboardProps) => {
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);
  const [openPopoverId, setOpenPopoverId] = React.useState<number | null>(null);

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
                    <Popover open={openPopoverId === team.id} onOpenChange={(isOpen) => setOpenPopoverId(isOpen ? team.id : null)}>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-accent-foreground">
                                <Edit className="w-4 h-4"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                           <TeamEditor team={team} onTeamUpdate={onTeamUpdate} closePopover={() => setOpenPopoverId(null)} />
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
