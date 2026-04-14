"use client";

import { useState, useTransition } from "react";
import { toggleTodo, deleteTodo, updateTodo } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2, Check, X } from "lucide-react";
import type { Todo } from "@/types/todo";
import { cn } from "@/lib/utils";

export function TodoItem({ todo }: { todo: Todo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => { await toggleTodo(todo.id, !todo.completed); });
  }

  function handleDelete() {
    startTransition(async () => { await deleteTodo(todo.id); });
  }

  function handleSaveEdit() {
    if (!editTitle.trim()) return;
    startTransition(async () => {
      await updateTodo(todo.id, editTitle.trim());
      setIsEditing(false);
    });
  }

  function handleCancelEdit() {
    setEditTitle(todo.title);
    setIsEditing(false);
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg border bg-card transition-opacity",
        isPending && "opacity-50"
      )}
    >
      <Checkbox
        checked={todo.completed}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />

      {isEditing ? (
        <div className="flex flex-1 gap-2">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveEdit();
              if (e.key === "Escape") handleCancelEdit();
            }}
            className="flex-1 h-8"
            autoFocus
          />
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEdit}>
            <Check className="w-4 h-4 text-green-600" />
          </Button>
          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      ) : (
        <>
          <span
            className={cn(
              "flex-1 text-sm",
              todo.completed && "line-through text-muted-foreground"
            )}
          >
            {todo.title}
          </span>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => setIsEditing(true)}
            disabled={isPending}
          >
            <Pencil className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </>
      )}
    </div>
  );
}
