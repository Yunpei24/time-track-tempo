
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { useTask } from "./TaskContext";

interface TimerContextProps {
  isRunning: boolean;
  isPaused: boolean;
  currentTaskId: string | null;
  seconds: number;
  startTimer: (taskId: string) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  elapsedTimeDisplay: string;
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const TimerProvider = ({ children }: { children: React.ReactNode }) => {
  const { addTimeToTask } = useTask();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [seconds, setSeconds] = useState<number>(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [savedTime, setSavedTime] = useState<{ taskId: string, seconds: number } | null>(null);

  // Load timer state from localStorage on mount
  useEffect(() => {
    const storedTimerState = localStorage.getItem("timerState");
    if (storedTimerState) {
      const { taskId, seconds, isRunning, isPaused } = JSON.parse(storedTimerState);
      setCurrentTaskId(taskId);
      setSeconds(seconds);
      setIsRunning(isRunning);
      setIsPaused(isPaused);
      
      // If the timer was running when the page was closed, restart it
      if (isRunning && !isPaused) {
        const id = window.setInterval(() => {
          setSeconds(prev => prev + 1);
        }, 1000);
        setIntervalId(id);
      }
    }
  }, []);

  // Save timer state to localStorage when it changes
  useEffect(() => {
    if (currentTaskId || seconds > 0) {
      localStorage.setItem("timerState", JSON.stringify({
        taskId: currentTaskId,
        seconds,
        isRunning,
        isPaused
      }));
    }
  }, [currentTaskId, seconds, isRunning, isPaused]);

  // Format the elapsed time as HH:MM:SS
  const elapsedTimeDisplay = React.useMemo(() => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [hours, minutes, secs]
      .map(v => v < 10 ? `0${v}` : v)
      .join(':');
  }, [seconds]);

  const startTimer = (taskId: string) => {
    // If there's already a timer running for a different task, save its progress
    if (isRunning && currentTaskId && currentTaskId !== taskId) {
      stopTimer();
    }
    
    // Clear any existing interval
    if (intervalId !== null) {
      clearInterval(intervalId);
    }
    
    setCurrentTaskId(taskId);
    setIsRunning(true);
    setIsPaused(false);
    
    // Start a new interval
    const id = window.setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    setIntervalId(id);
    
    toast.success("Chronomètre démarré");
  };

  const pauseTimer = () => {
    if (!isRunning || !intervalId) return;
    
    clearInterval(intervalId);
    setIntervalId(null);
    setIsPaused(true);
    
    toast.info("Chronomètre en pause");
  };

  const resumeTimer = () => {
    if (!isPaused || !currentTaskId) return;
    
    const id = window.setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    setIntervalId(id);
    setIsPaused(false);
    
    toast.info("Chronomètre repris");
  };

  const stopTimer = () => {
    if (!isRunning && !isPaused) return;
    
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    if (currentTaskId && seconds > 0) {
      const minutes = Math.floor(seconds / 60);
      addTimeToTask(currentTaskId, minutes > 0 ? minutes : 1); // Minimum 1 minute
      toast.success(`Temps ajouté: ${Math.floor(seconds / 60)} minute(s)`);
    }
    
    // Reset timer state
    setIsRunning(false);
    setIsPaused(false);
    setCurrentTaskId(null);
    setSeconds(0);
    localStorage.removeItem("timerState");
  };

  return (
    <TimerContext.Provider
      value={{
        isRunning,
        isPaused,
        currentTaskId,
        seconds,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        elapsedTimeDisplay
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};
