import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime: number, onTimeUp?: () => void) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, timeRemaining, onTimeUp]);

  const start = () => setIsRunning(true);
  const stop = () => setIsRunning(false);
  const reset = (newTime?: number) => {
    setTimeRemaining(newTime || initialTime);
    setIsRunning(false);
  };

  return {
    timeRemaining,
    isRunning,
    start,
    stop,
    reset,
  };
};
