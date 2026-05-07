import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TaskFilterParams, TaskStatus } from "@/types/task";

type FilterValues = Pick<TaskFilterParams, "status" | "search">;

type TaskFiltersProps = {
  filters: FilterValues;
  onFiltersChange: (filters: FilterValues) => void;
};

const statusOptions: { label: string; value: TaskStatus | "" }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Completed", value: "completed" }
];

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const onFiltersChangeRef = useRef(onFiltersChange);
  onFiltersChangeRef.current = onFiltersChange;

  const filtersStatusRef = useRef(filters.status);
  filtersStatusRef.current = filters.status;

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      onFiltersChangeRef.current({
        status: filtersStatusRef.current,
        search: searchInput
      });
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex gap-1">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={filters.status === option.value ? "default" : "outline"}
            size="sm"
            onClick={() =>
              onFiltersChange({ ...filters, status: option.value })
            }
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title or description..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
