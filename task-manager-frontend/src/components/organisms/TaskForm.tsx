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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      toast.error("Title is required");
      return;
    }

    if (trimmedTitle.length > TITLE_MAX_LENGTH) {
      toast.error(`Title must be ${TITLE_MAX_LENGTH} characters or less`);
      return;
    }

    if (description.trim().length > DESCRIPTION_MAX_LENGTH) {
      toast.error(`Description must be ${DESCRIPTION_MAX_LENGTH} characters or less`);
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
        aria-invalid={title.length > TITLE_MAX_LENGTH}
        required
      />
      <p className={`text-xs ${title.length > TITLE_MAX_LENGTH ? "text-destructive" : "text-muted-foreground"}`}>
        {title.length}/{TITLE_MAX_LENGTH}
      </p>
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        aria-invalid={description.length > DESCRIPTION_MAX_LENGTH}
        rows={2}
      />
      <p className={`text-xs ${description.length > DESCRIPTION_MAX_LENGTH ? "text-destructive" : "text-muted-foreground"}`}>
        {description.length}/{DESCRIPTION_MAX_LENGTH}
      </p>
      <Button type="submit" disabled={isSubmitting || title.length > TITLE_MAX_LENGTH || description.length > DESCRIPTION_MAX_LENGTH} className="self-end">
        <Plus className="size-4" data-icon="inline-start" />
        {isSubmitting ? "Creating..." : "Add Task"}
      </Button>
    </form>
  );
}
