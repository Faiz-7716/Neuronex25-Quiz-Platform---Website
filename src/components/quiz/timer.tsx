import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

type TimerProps = {
  duration: number;
  onTimeUp: () => void;
};

const Timer = ({ duration, onTimeUp }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize Audio on the client side after mount
    if (typeof window !== 'undefined' && !audioRef.current) {
        audioRef.current = new Audio('/sounds/timer-loop.mp3');
        audioRef.current.loop = true;
    }
  }, []);

  useEffect(() => {
    setTimeLeft(duration);
    
    // Play audio when timer starts
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => console.error("Audio play failed:", error));
    }

    // Cleanup audio on component unmount or when duration changes
    return () => {
      if (audio && !audio.paused) {
        audio.pause();
      }
    };
  }, [duration]);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      if(audioRef.current){
        audioRef.current.pause();
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, onTimeUp]);

  const percentage = (timeLeft / duration) * 100;
  let colorClass = 'text-green-400';
  let bgColorClass = 'bg-green-500';

  if (percentage <= 50 && percentage > 25) {
    colorClass = 'text-yellow-400';
    bgColorClass = 'bg-yellow-500';
  } else if (percentage <= 25) {
    colorClass = 'text-red-500';
    bgColorClass = 'bg-red-500';
  }
  
  return (
    <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="relative w-full sm:w-48 h-4 bg-muted rounded-full overflow-hidden">
            <motion.div
                className={`h-full ${bgColorClass}`}
                initial={{ width: '100%' }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, ease: 'linear' }}
            />
        </div>
        <div className={`font-mono text-4xl font-bold ${colorClass}`}>
            {String(timeLeft).padStart(2, '0')}
        </div>
    </div>
  );
};

export default Timer;
