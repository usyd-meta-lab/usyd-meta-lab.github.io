import { useState, useEffect, useRef, useCallback } from "react";

export function useTaskTimer(guidanceMinutes: number) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const guidanceSeconds = guidanceMinutes * 60;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setElapsed(0);
    setIsRunning(false);
  }, []);

  const isGuidanceReached = elapsed >= guidanceSeconds;
  const formatted = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, "0")}`;

  return { elapsed, formatted, isRunning, isGuidanceReached, start, stop, reset };
}
