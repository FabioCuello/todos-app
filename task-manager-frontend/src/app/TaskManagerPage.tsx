import { useState } from "react";
import { TaskForm } from "@/components/organisms/TaskForm";
import { TaskFilters } from "@/components/organisms/TaskFilters";
import { TaskList } from "@/components/organisms/TaskList";
import { Pagination } from "@/components/molecules/Pagination";
import { useTasks } from "@/hooks/useTasks";
import type { TaskFilterParams } from "@/types/task";

const PAGE_SIZE = 10;

export function TaskManagerPage() {
  const [filters, setFilters] = useState<TaskFilterParams>({
    status: "",
    search: "",
    limit: PAGE_SIZE,
    offset: 0
  });

  const { tasks, total, isLoading, createTask, completeTask, markPending, deleteTask, isCreating } =
    useTasks(filters);

  const currentPage = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = Math.ceil(total / filters.limit);

  const handleFiltersChange = (partial: {
    status: TaskFilterParams["status"];
    search: string;
  }) => {
    setFilters({ ...partial, limit: PAGE_SIZE, offset: 0 });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, offset: (page - 1) * prev.limit }));
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="mb-8 text-2xl font-bold tracking-tight">Task Manager</h1>
      <div className="flex flex-col gap-6">
        <TaskForm onSubmit={createTask} isSubmitting={isCreating} />
        <TaskFilters filters={filters} onFiltersChange={handleFiltersChange} />
        <TaskList tasks={tasks} isLoading={isLoading} onComplete={completeTask} onMarkPending={markPending} onDelete={deleteTask} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
