import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, Pencil, Check, X, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const { data } = await supabase
      .from("todos")
      .select("*")
      .order("created_at", { ascending: false });
    setTodos(data || []);
    setLoading(false);
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const { data } = await supabase
      .from("todos")
      .insert({ title: newTitle.trim() })
      .select()
      .single();
    if (data) setTodos([data, ...todos]);
    setNewTitle("");
  }

  async function toggleTodo(id: string, completed: boolean) {
    await supabase.from("todos").update({ completed }).eq("id", id);
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed } : t)));
  }

  async function deleteTodo(id: string) {
    await supabase.from("todos").delete().eq("id", id);
    setTodos(todos.filter((t) => t.id !== id));
  }

  async function saveEdit(id: string) {
    if (!editTitle.trim()) return;
    await supabase.from("todos").update({ title: editTitle.trim() }).eq("id", id);
    setTodos(todos.map((t) => (t.id === id ? { ...t, title: editTitle.trim() } : t)));
    setEditingId(null);
  }

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <ClipboardList className="w-7 h-7" />
            <h1 className="text-3xl font-bold">Todo List</h1>
          </div>
          <p className="text-sm text-muted-foreground">Vite + React + Supabase</p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium text-muted-foreground">
              {loading ? "加载中..." : `${completedCount} / ${todos.length} 已完成`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={addTodo} className="flex gap-2">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="添加新任务..."
                className="flex-1"
              />
              <Button type="submit" disabled={!newTitle.trim()}>
                <PlusCircle className="w-4 h-4 mr-2" />
                添加
              </Button>
            </form>

            {!loading && todos.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                暂无任务，添加一个吧
              </p>
            )}

            <div className="space-y-2">
              {todos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                    className="h-4 w-4 rounded border-primary accent-primary cursor-pointer"
                  />

                  {editingId === todo.id ? (
                    <div className="flex flex-1 gap-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(todo.id);
                          if (e.key === "Escape") setEditingId(null);
                        }}
                        className="flex-1 h-8"
                        autoFocus
                      />
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => saveEdit(todo.id)}>
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <span className={cn("flex-1 text-sm", todo.completed && "line-through text-muted-foreground")}>
                        {todo.title}
                      </span>
                      <Button
                        size="icon" variant="ghost" className="h-8 w-8"
                        onClick={() => { setEditingId(todo.id); setEditTitle(todo.title); }}
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => deleteTodo(todo.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
