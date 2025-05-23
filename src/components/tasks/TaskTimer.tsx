
import React from "react";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/contexts/TimerContext";
import { useTask } from "@/contexts/TaskContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlayIcon, PauseIcon, SquareIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const TaskTimer: React.FC = () => {
  const { tasks } = useTask();
  const {
    isRunning,
    isPaused,
    currentTaskId,
    elapsedTimeDisplay,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    seconds,
  } = useTimer();
  const isMobile = useIsMobile();

  const activeTasks = tasks.filter(
    (task) => task.status !== "completed" && task.timeSpent < task.timeEstimate
  );

  const currentTask = currentTaskId
    ? tasks.find((task) => task.id === currentTaskId)
    : null;

  const handleTaskSelect = (taskId: string) => {
    if (taskId && !isRunning && !isPaused) {
      startTimer(taskId);
    }
  };

  // Calculate progress percentage for timer circle
  const progress = React.useMemo(() => {
    // 12 hour max timer (43200 seconds)
    const maxSeconds = 12 * 60 * 60;
    return 283 * (1 - ((seconds % maxSeconds) / maxSeconds));
  }, [seconds]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-sm sm:text-base">Chronomètre</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Suivez le temps passé sur vos tâches
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-0 px-2 sm:px-4">
        <div className="relative w-28 h-28 xs:w-32 xs:h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 mb-3 sm:mb-4 md:mb-5">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              className={`timer-circle ${isRunning && !isPaused ? "animate-timer-pulse" : ""}`}
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeLinecap="round"
              style={{ strokeDashoffset: progress }}
            />
          </svg>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold">{elapsedTimeDisplay}</div>
              {currentTask && (
                <div className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 max-w-[70px] xs:max-w-[90px] sm:max-w-[110px] md:max-w-[120px] truncate">
                  {currentTask.title}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full space-y-2 sm:space-y-3 md:space-y-4">
          {!isRunning && !isPaused ? (
            <Select
              onValueChange={handleTaskSelect}
              disabled={isRunning || isPaused}
            >
              <SelectTrigger className="w-full text-xs sm:text-sm h-8 sm:h-9 md:h-10 min-h-8">
                <SelectValue placeholder="Sélectionner une tâche" />
              </SelectTrigger>
              <SelectContent>
                {activeTasks.length > 0 ? (
                  activeTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id}>
                      {task.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-tasks" disabled>
                    Aucune tâche active disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          ) : (
            <div className="h-8 sm:h-9 md:h-10"></div>
          )}

          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            {!isRunning && !isPaused ? (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={activeTasks.length === 0}
                size={isMobile ? "sm" : "default"}
                onClick={() => {
                  if (!currentTaskId && activeTasks.length > 0) {
                    startTimer(activeTasks[0].id);
                  }
                }}
              >
                <PlayIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 xs:mr-1 sm:mr-1.5" /> 
                <span className="text-2xs xs:text-xs sm:text-sm">Commencer</span>
              </Button>
            ) : isPaused ? (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                size={isMobile ? "sm" : "default"}
                onClick={resumeTimer}
              >
                <PlayIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 xs:mr-1 sm:mr-1.5" /> 
                <span className="text-2xs xs:text-xs sm:text-sm">Reprendre</span>
              </Button>
            ) : (
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700"
                size={isMobile ? "sm" : "default"}
                onClick={pauseTimer}
              >
                <PauseIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 xs:mr-1 sm:mr-1.5" /> 
                <span className="text-2xs xs:text-xs sm:text-sm">Pause</span>
              </Button>
            )}
            <Button
              variant="destructive"
              className="w-full"
              disabled={!isRunning && !isPaused}
              size={isMobile ? "sm" : "default"}
              onClick={stopTimer}
            >
              <SquareIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-0.5 xs:mr-1 sm:mr-1.5" /> 
              <span className="text-2xs xs:text-xs sm:text-sm">Arrêter</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskTimer;
