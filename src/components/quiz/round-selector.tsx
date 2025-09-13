import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { roundDetails } from '@/lib/data';

type RoundSelectorProps = {
  currentRound: number;
  onRoundChange: (round: number) => void;
  isDisabled: boolean;
};

const RoundSelector = ({ currentRound, onRoundChange, isDisabled }: RoundSelectorProps) => {
  const rounds = Object.keys(roundDetails).map(Number);

  return (
    <div>
      <Select
        value={String(currentRound)}
        onValueChange={(value) => onRoundChange(Number(value))}
        disabled={isDisabled}
      >
        <SelectTrigger className="w-[220px] bg-card/70 backdrop-blur-sm font-headline">
          <SelectValue placeholder="Select a round" />
        </SelectTrigger>
        <SelectContent>
          {rounds.map(round => (
            <SelectItem key={round} value={String(round)}>
              Round {round}: {roundDetails[round].title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RoundSelector;
