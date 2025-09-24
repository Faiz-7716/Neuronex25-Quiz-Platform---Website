import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { roundDetails } from '@/lib/data';
import { ChevronsRight, Users, Trophy, HelpCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

type QuizOverviewProps = {
  onContinue: () => void;
};

const roundInfo = [
    {
        round: 1,
        format: 'MCQ',
        time: '30s',
        points: '+10 / +5 (Passed)',
        pass: true,
    },
    {
        round: 2,
        format: 'Logo Identification',
        time: '30s',
        points: '+10 / +5 (Passed)',
        pass: true,
    },
    {
        round: 3,
        format: 'Acronyms (MCQ)',
        time: '30s',
        points: '+10 / +5 (Passed)',
        pass: true,
    },
    {
        round: 4,
        format: 'Cybersecurity (MCQ)',
        time: '45s',
        points: '+10',
        pass: false,
    }
]

const QuizOverview = ({ onContinue }: QuizOverviewProps) => {
  const rounds = Object.entries(roundDetails);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-5xl md:text-7xl font-headline font-bold text-primary mb-4 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Quiz Structure
      </motion.h1>
      <motion.p
        className="text-lg text-muted-foreground mb-12 text-center max-w-2xl"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        Here's a look at the journey to crown the tech champion.
      </motion.p>
      
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {rounds.map(([roundNum, details], index) => {
          const isFinalRound = index === rounds.length - 1;
          const teamsEntering = index === 0 ? 10 : roundDetails[Number(roundNum) - 1]?.teamsAdvancing || 0;
          const extraInfo = roundInfo.find(r => r.round === Number(roundNum));

          return (
            <motion.div
              key={roundNum}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.2, duration: 0.5 }}
            >
              <Card className="h-full flex flex-col text-center">
                <CardHeader className="pb-4">
                  <p className="font-headline text-sm text-primary font-semibold">ROUND {roundNum}</p>
                  <CardTitle className="font-headline text-2xl">{details.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between gap-4">
                    <div className="text-left text-sm space-y-3 text-foreground/80">
                        <div className="flex items-start gap-3">
                            <HelpCircle className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" />
                            <span><span className="font-semibold">Format:</span> {extraInfo?.format}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" />
                            <span><span className="font-semibold">Time:</span> {extraInfo?.time} per question</span>
                        </div>
                        <div className="flex items-start gap-3">
                            <Trophy className="w-5 h-5 mt-0.5 text-accent flex-shrink-0" />
                            <span><span className="font-semibold">Points:</span> {extraInfo?.points}</span>
                        </div>
                        <div className="flex items-start gap-3">
                            {extraInfo?.pass ? (
                                <CheckCircle className="w-5 h-5 mt-0.5 text-success flex-shrink-0" />
                            ) : (
                                <XCircle className="w-5 h-5 mt-0.5 text-destructive flex-shrink-0" />
                            )}
                            <span>Passing is {extraInfo?.pass ? <span className="font-semibold text-success">enabled</span> : <span className="font-semibold text-destructive">disabled</span>}</span>
                        </div>
                    </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2 text-base">
                        <Users className="text-muted-foreground" />
                        <span><strong className="font-bold">{teamsEntering}</strong> Teams Compete</span>
                    </div>
                    <ChevronsRight className="text-muted-foreground mx-auto" />
                    <div className="flex items-center justify-center gap-2 text-base">
                        {isFinalRound ? (
                        <>
                            <Trophy className="text-yellow-400" />
                            <span><strong className="font-bold">Top 3</strong> Winners</span>
                        </>
                        ) : (
                        <>
                            <Users className="text-success" />
                            <span><strong className="font-bold">{details.teamsAdvancing}</strong> Teams Advance</span>
                        </>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <Button onClick={onContinue} size="lg" className="font-headline text-lg mt-8">
          Let's Begin
        </Button>
      </motion.div>
    </motion.div>
  );
};
