"use client";

import { useState, useTransition } from "react";
import { createTodo } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";

export function AddTodoForm() {
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    startTransition(async () => {
      await createTodo(title.trim());
      setTitle("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="添加新任务..."
        disabled={isPending}
        className="flex-1"
      />
      <Button type="submit" disabled={isPending || !title.trim()}>
        <PlusCircle className="w-4 h-4 mr-2" />
        添加
      </Button>
    </form>
  );
}
