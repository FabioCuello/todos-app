import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchTasks, createTask, completeTask, pendingTask, deleteTask } from "@/api/tasks";
import type { TaskFilterParams, CreateTaskData } from "@/types/task";

export const useTasks = (filters: TaskFilterParams) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ["TASKS", filters.status, filters.search, filters.limit, filters.offset],
    () => fetchTasks(filters),
    { retry: false, keepPreviousData: true }
  );

  const createMutation = useMutation(createTask, {
    onSuccess: () => queryClient.invalidateQueries(["TASKS"])
  });

  const completeMutation = useMutation(completeTask, {
    onSuccess: () => queryClient.invalidateQueries(["TASKS"])
  });

  const pendingMutation = useMutation(pendingTask, {
    onSuccess: () => queryClient.invalidateQueries(["TASKS"])
  });

  const deleteMutation = useMutation(deleteTask, {
    onSuccess: () => queryClient.invalidateQueries(["TASKS"])
  });

  const mutatingTaskIds = new Set(
    [completeMutation, pendingMutation, deleteMutation]
      .filter((m) => m.isLoading && m.variables !== undefined)
      .map((m) => m.variables as number)
  );

  return {
    tasks: data?.tasks ?? [],
    total: data?.total ?? 0,
    isLoading,
    createTask: (data: CreateTaskData) => createMutation.mutateAsync(data),
    completeTask: (taskId: number) => completeMutation.mutate(taskId),
    markPending: (taskId: number) => pendingMutation.mutate(taskId),
    deleteTask: (taskId: number) => deleteMutation.mutate(taskId),
    isCreating: createMutation.isLoading,
    mutatingTaskIds
  };
};
