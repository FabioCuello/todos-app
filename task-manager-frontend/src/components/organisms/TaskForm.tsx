import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type TaskFormProps = {
  onSubmit: (data: { title: string; description?: string }) => Promise<unknown>;
  isSubmitting: boolean;
};

const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 1000;

export function TaskForm({ onSubmit, isSubmitting }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isTitleOverLimit = title.length > TITLE_MAX_LENGTH;
  const isDescriptionOverLimit = description.length > DESCRIPTION_MAX_LENGTH;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error("Title is required");
      return;
    }

    try {
      await onSubmit({
        title: trimmedTitle,
        description: description.trim() || undefined
      });
      setTitle("");
      setDescription("");
      toast.success("Task created");
    } catch {
      toast.error("Failed to create task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        aria-invalid={isTitleOverLimit}
        required
      />
      <p className={`text-xs ${isTitleOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
        {title.length}/{TITLE_MAX_LENGTH}
      </p>
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        aria-invalid={isDescriptionOverLimit}
        rows={2}
      />
      <p className={`text-xs ${isDescriptionOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
        {description.length}/{DESCRIPTION_MAX_LENGTH}
      </p>
      <Button type="submit" disabled={isSubmitting || isTitleOverLimit || isDescriptionOverLimit} className="self-end">
        <Plus className="size-4" data-icon="inline-start" />
        {isSubmitting ? "Creating..." : "Add Task"}
      </Button>
    </form>
  );
}
