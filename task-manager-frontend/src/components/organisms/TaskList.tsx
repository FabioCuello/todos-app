import { Check, Undo2, Trash2, ClipboardList, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction
} from "@/components/ui/card";
import type { Task } from "@/types/task";

type TaskListProps = {
  tasks: Task[];
  isLoading: boolean;
  onComplete: (taskId: number) => void;
  onMarkPending: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  mutatingTaskIds: Set<number>;
};

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function TaskList({ tasks, isLoading, onComplete, onMarkPending, onDelete, mutatingTaskIds }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
        <ClipboardList className="size-10" />
        <p className="text-sm">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => {
        const isMutating = mutatingTaskIds.has(task.taskId);

        return (
          <Card key={task.taskId} size="sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 break-all">
                {task.title}
                <Badge
                  variant={task.status === "completed" ? "default" : "secondary"}
                  className={
                    task.status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }
                >
                  {task.status}
                </Badge>
              </CardTitle>
              {task.description && (
                <CardDescription>{task.description}</CardDescription>
              )}
              <CardAction>
                <div className="flex gap-1">
                  {task.status === "pending" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isMutating}
                      onClick={() => onComplete(task.taskId)}
                    >
                      {isMutating ? (
                        <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />
                      ) : (
                        <Check className="size-3.5" data-icon="inline-start" />
                      )}
                      Complete
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isMutating}
                      onClick={() => onMarkPending(task.taskId)}
                    >
                      {isMutating ? (
                        <Loader2 className="size-3.5 animate-spin" data-icon="inline-start" />
                      ) : (
                        <Undo2 className="size-3.5" data-icon="inline-start" />
                      )}
                      Undo
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Delete"
                    disabled={isMutating}
                    onClick={() => onDelete(task.taskId)}
                  >
                    {isMutating ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </Button>
                </div>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Created {formatDate(task.createdAt)}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
