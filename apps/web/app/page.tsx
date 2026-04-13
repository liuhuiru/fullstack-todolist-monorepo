import { getTodos } from "@/app/actions";
import { AddTodoForm } from "@/components/add-todo-form";
import { TodoItem } from "@/components/todo-item";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

export default async function Home() {
  const todos = await getTodos();
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <ClipboardList className="w-7 h-7" />
            <h1 className="text-3xl font-bold">Todo List</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Next.js + Supabase Server Actions
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">
              {completedCount} / {todos.length} 已完成
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AddTodoForm />

            {todos.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-8">
                暂无任务，添加一个吧
              </p>
            ) : (
              <div className="space-y-2">
                {todos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
