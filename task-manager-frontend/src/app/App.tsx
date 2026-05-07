import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache
} from "react-query";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { TaskManagerPage } from "@/app/TaskManagerPage";

const client = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  })
});

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <TaskManagerPage />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
