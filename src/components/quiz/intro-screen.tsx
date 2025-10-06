
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type IntroScreenProps = {
  onStart: () => void;
};

const IntroScreen = ({ onStart }: IntroScreenProps) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen text-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-8 rounded-lg">
        <motion.div 
            className="flex justify-center items-center gap-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
        >
            <Image src="/event_logo/logo.jpeg" alt="Event Logo 1" width={100} height={100} />
            <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-headline font-bold text-primary mb-4"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
            >
              Neuronex' 25 Mind Crasher
            </motion.h1>
            <Image src="/event_logo/logo2.jpg" alt="Department Logo" width={100} height={100} />
        </motion.div>
        <motion.p 
            className="text-lg md:text-xl text-foreground/70 mb-12 max-w-2xl mx-auto"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
        >
          An interactive quiz competition for the sharpest minds in tech. The ultimate battle of wits begins now.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 120 }}
        >
          <Button
            size="lg"
            onClick={onStart}
            className="font-headline text-lg px-12 py-8 rounded-full bg-primary-gradient text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/50 hover:scale-105"
          >
            Start Quiz
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default IntroScreen;
