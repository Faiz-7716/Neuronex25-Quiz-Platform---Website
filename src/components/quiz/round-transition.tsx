import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Play } from 'lucide-react';
import { parseRules } from '@/lib/utils';

type RoundTransitionProps = {
  roundNumber: number;
  roundTitle: string;
  rules: string;
  onContinue: () => void;
};

const RoundTransition = ({ roundNumber, roundTitle, rules, onContinue }: RoundTransitionProps) => {
  const parsedRules = parseRules(rules);

  return (
    <motion.div
      key={`round-${roundNumber}`}
      className="flex flex-col items-center justify-center min-h-screen text-center p-4"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
        <motion.h2
            className="text-3xl md:text-5xl font-headline text-muted-foreground mb-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
        >
            Round {roundNumber}
        </motion.h2>
        <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
        >
            {roundTitle}
        </motion.h1>

        <motion.div 
            className="w-full max-w-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
        >
            <Card className="bg-card/50 text-left">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-2xl text-primary">
                        <FileText />
                        Round Rules
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 text-foreground">
                        {parsedRules.map((section, index) => (
                            <div key={index} className="break-inside-avoid">
                            <h4 className="font-headline text-xl text-accent mb-2">{section.title}</h4>
                            <ul className="list-disc pl-5 space-y-2 text-base leading-relaxed">
                                {section.points.map((point, pIndex) => (
                                <li key={pIndex}>{point}</li>
                                ))}
                            </ul>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
        
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
        >
            <Button onClick={onContinue} size="lg" className="font-headline text-lg mt-12">
                <Play className="mr-2" />
                Start Round
            </Button>
        </motion.div>
    </motion.div>
  );
};

export default RoundTransition;
