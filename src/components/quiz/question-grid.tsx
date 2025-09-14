import type { Question, QuestionStatus } from '@/lib/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type QuestionGridProps = {
  questions: Question[];
  onQuestionSelect: (question: Question) => void;
};

const getStatusColor = (status: QuestionStatus) => {
  switch (status) {
    case 'available':
      return 'bg-secondary hover:bg-accent/20 border-border';
    case 'correct':
      return 'bg-success/80 border-success';
    case 'wrong':
      return 'bg-destructive/80 border-destructive';
    default:
      return 'bg-muted/50';
  }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: { opacity: 1, scale: 1 },
  };

const QuestionGrid = ({ questions, onQuestionSelect }: QuestionGridProps) => {

  const getQuestionLabel = (question: Question, index: number) => {
    return String(index + 1);
  }

  return (
    <motion.div 
        className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
    >
      {questions.slice(0, 30).map((question, index) => (
        <motion.div key={question.id} variants={itemVariants}>
            <button
                onClick={() => onQuestionSelect(question)}
                disabled={question.status !== 'available'}
                className={cn(
                    'w-[70px] h-[70px] rounded-2xl border-2 flex items-center justify-center font-headline text-3xl font-bold shadow-sm transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary focus:ring-opacity-50',
                    getStatusColor(question.status),
                    question.status === 'available' ? 'text-foreground/80' : 'text-primary-foreground',
                    question.status !== 'available' && 'cursor-not-allowed opacity-70'
                )}
                aria-label={`Question ${index + 1}, Status: ${question.status}`}
            >
                {getQuestionLabel(question, index)}
            </button>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default QuestionGrid;
