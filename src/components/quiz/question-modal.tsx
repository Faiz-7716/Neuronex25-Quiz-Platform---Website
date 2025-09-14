import * as React from 'react';
import Image from 'next/image';
import type { Question } from '@/lib/types';
import Timer from './timer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Icons } from '@/components/icons';
import { motion } from 'framer-motion';

type QuestionModalProps = {
  question: Question;
  teamName: string;
  isOpen: boolean;
  onClose: () => void;
  onAnswer: (isCorrect: boolean) => void;
  onPass: () => void;
  roundNumber: number;
  isTieBreaker?: boolean;
};

type AnswerStatus = 'unanswered' | 'correct' | 'incorrect';

const CodeSnippet = ({ code, language }: { code: string; language: keyof typeof Icons }) => {
  const Icon = Icons[language];
  return (
    <div className="bg-slate-900 rounded-lg p-4 font-mono text-left text-sm md:text-base border border-slate-700">
      <div className="flex justify-between items-center mb-2 text-slate-400">
        <span className="capitalize flex items-center gap-2">
          <Icon className="w-4 h-4" />
          {language === 'cpp' ? 'C++' : language.charAt(0).toUpperCase() + language.slice(1)}
        </span>
      </div>
      <pre className="text-slate-200 whitespace-pre-wrap overflow-x-auto">{code}</pre>
    </div>
  );
};

const QuestionModal = ({ question, teamName, isOpen, onClose, onAnswer, onPass, roundNumber, isTieBreaker = false }: QuestionModalProps) => {
  const [selectedAnswer, setSelectedAnswer] = React.useState('');
  const [textAnswer, setTextAnswer] = React.useState('');
  const [answerStatus, setAnswerStatus] = React.useState<AnswerStatus>('unanswered');
  const [isTimeUp, setIsTimeUp] = React.useState(false);
  
  const timerDuration = isTieBreaker ? 15 : (roundNumber === 4 ? 60 : 30);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (answerStatus !== 'unanswered') return;

    let isCorrect = false;

    if (question.type === 'mcq' && question.options) {
      isCorrect = selectedAnswer === question.answer;
    } else { // logo, code, or tie-breaker text
      isCorrect = textAnswer.trim().toLowerCase() === question.answer.toLowerCase();
    }
    
    if (!isTieBreaker) {
      setAnswerStatus(isCorrect ? 'correct' : 'incorrect');
    }
    onAnswer(isCorrect);
  };
  
  const handleTimeUp = () => {
    if (answerStatus !== 'unanswered') return;
    
    if(isTieBreaker || roundNumber >= 4) {
      onAnswer(false);
    } else {
      setIsTimeUp(true);
    }
  };

  const handleShowAnswer = () => {
    setAnswerStatus('incorrect');
    onAnswer(false);
  };

  React.useEffect(() => {
    if (isOpen) {
        setAnswerStatus('unanswered');
        setSelectedAnswer('');
        setTextAnswer('');
        setIsTimeUp(false);
    }
  }, [isOpen, question.id]);

  React.useEffect(() => {
    // Reset time up state when team changes for the same question (pass scenario)
    setIsTimeUp(false);
  }, [teamName]);

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'mcq':
        if (question.options) {
          return (
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-4 my-6" disabled={answerStatus !== 'unanswered'}>
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-lg text-foreground cursor-pointer">{option}</Label>
                </div>
              ))}
            </RadioGroup>
          );
        }
        return (
          <div className="my-6 text-xl md:text-2xl font-semibold leading-relaxed">
            {question.content}
          </div>
        )
      case 'logo':
        return (
          <div className="my-6 flex justify-center">
            <Image 
              data-ai-hint="logo company"
              src={question.content} 
              alt="Brand Logo" 
              width={300} 
              height={200} 
              className="rounded-lg bg-white p-2 shadow-md" 
            />
          </div>
        );
      case 'code':
        return (
          <div className="my-6">
            <CodeSnippet code={question.content} language={question.language!} />
          </div>
        );
      default:
        return null;
    }
  };

  const renderAnswerResult = () => {
    if (answerStatus === 'unanswered' || isTieBreaker) return null;

    if (answerStatus === 'correct') {
      return (
        <Alert variant="default" className="mt-4 bg-green-600 border-green-600 text-white text-center">
          <AlertTitle>Correct!</AlertTitle>
          <AlertDescription>
            {`Well done, ${teamName}!`}
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <Alert variant="destructive" className="mt-4 text-center">
        <AlertTitle>Incorrect!</AlertTitle>
        <AlertDescription>
          The correct answer was: <span className="font-bold text-lg">{question.answer}</span>
        </AlertDescription>
      </Alert>
    );
  }
  
  const renderFooterContent = () => {
    if (answerStatus !== 'unanswered' && !isTieBreaker) {
        return (
             <div className="w-full text-center">
                <Button onClick={onClose} className="font-headline">Close</Button>
            </div>
        )
    }

    if (isTimeUp) {
      return (
        <div className="w-full flex flex-col items-center gap-4">
          <motion.h3 
            className="text-3xl font-bold text-destructive"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            Time's Up!
          </motion.h3>
          <div className="flex gap-4">
            <Button onClick={onPass} className="font-headline">Pass to Next Team</Button>
            <Button onClick={handleShowAnswer} variant="outline" className="font-headline">Show Answer & Forfeit</Button>
          </div>
        </div>
      );
    }
    
    const showPassButton = roundNumber < 4 && !isTieBreaker;

    return (
        <>
            <Timer key={question.id + teamName} duration={timerDuration} onTimeUp={handleTimeUp} />
            <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                {(question.type !== 'mcq' || !question.options) && (
                    <Input
                        type="text"
                        placeholder="Your answer..."
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        className="w-full"
                        autoFocus
                    />
                )}
                <Button type="submit" className="font-headline" disabled={(!selectedAnswer && !textAnswer)}>Submit</Button>
                {showPassButton && <Button type="button" variant="outline" className="font-headline" onClick={onPass}>Pass</Button>}
            </form>
        </>
    )
  }
  
  const title = isTieBreaker ? `Tie-Breaker for ${teamName}` :`Question for ${teamName}`;
  const description = isTieBreaker 
    ? "First to answer correctly wins!" 
    : (question.type === 'mcq' && question.options ? question.content : 'Identify the following:');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl bg-background/90 backdrop-blur-lg border-primary/30">
        <DialogHeader>
          <DialogTitle className="font-headline text-3xl text-primary">{title}</DialogTitle>
          <DialogDescription className="text-lg">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 text-center">
            {renderQuestionContent()}
            {renderAnswerResult()}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between w-full">
           {renderFooterContent()}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuestionModal;
