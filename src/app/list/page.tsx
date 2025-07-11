import TodoList from "@/components/TodoList";
import ViewTabs from "@/components/ViewTabs";

export default function TodoListPage() {
  return (
    <main className="max-w-2xl mx-auto p-4">
      <ViewTabs />
      <h1 className="text-2xl font-bold mb-4">待辦清單</h1>
      <TodoList />
    </main>
  );
}
