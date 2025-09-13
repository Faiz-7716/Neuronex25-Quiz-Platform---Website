import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';
import { parseRules } from '@/lib/utils';

type RulesDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  roundNumber: number;
  rules: string;
};

const RulesDialog = ({ isOpen, onClose, roundNumber, rules }: RulesDialogProps) => {
    const parsedRules = parseRules(rules);

    return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl bg-background/90 backdrop-blur-lg border-primary/30">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl text-primary flex items-center gap-2">
            <FileText />
            Round {roundNumber} Rules
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <ScrollArea className="h-96 pr-4">
            <div className="space-y-4 text-foreground">
              {parsedRules.map((section, index) => (
                <div key={index}>
                  <h4 className="font-headline text-lg text-accent mb-2">{section.title}</h4>
                  <ul className="list-disc pl-5 space-y-1 text-base leading-relaxed">
                    {section.points.map((point, pIndex) => (
                      <li key={pIndex}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RulesDialog;
