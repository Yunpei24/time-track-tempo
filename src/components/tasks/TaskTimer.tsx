
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlayIcon, PauseIcon, StopIcon } from "lucide-react";

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
    <Card>
      <CardHeader>
        <CardTitle>Chronomètre</CardTitle>
        <CardDescription>
          Suivez le temps passé sur vos tâches
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-6">
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
              <div className="text-3xl font-bold">{elapsedTimeDisplay}</div>
              {currentTask && (
                <div className="text-sm text-gray-500 mt-1 max-w-[120px] truncate">
                  {currentTask.title}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full space-y-4">
          {!isRunning && !isPaused ? (
            <Select
              onValueChange={handleTaskSelect}
              disabled={isRunning || isPaused}
            >
              <SelectTrigger className="w-full">
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
            <div className="h-10"></div>
          )}

          <div className="grid grid-cols-2 gap-2">
            {!isRunning && !isPaused ? (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={activeTasks.length === 0}
                onClick={() => {
                  if (!currentTaskId && activeTasks.length > 0) {
                    startTimer(activeTasks[0].id);
                  }
                }}
              >
                <PlayIcon className="mr-2 h-4 w-4" /> Commencer
              </Button>
            ) : isPaused ? (
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={resumeTimer}
              >
                <PlayIcon className="mr-2 h-4 w-4" /> Reprendre
              </Button>
            ) : (
              <Button
                className="w-full bg-amber-600 hover:bg-amber-700"
                onClick={pauseTimer}
              >
                <PauseIcon className="mr-2 h-4 w-4" /> Pause
              </Button>
            )}
            <Button
              variant="destructive"
              className="w-full"
              disabled={!isRunning && !isPaused}
              onClick={stopTimer}
            >
              <StopIcon className="mr-2 h-4 w-4" /> Arrêter
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskTimer;
