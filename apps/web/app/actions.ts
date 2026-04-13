"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Todo } from "@/types/todo";

export async function getTodos(): Promise<Todo[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching todos:", error);
    return [];
  }

  return data || [];
}

export async function createTodo(title: string) {
  const supabase = createClient();
  const { error } = await supabase.from("todos").insert({ title });

  if (error) {
    console.error("Error creating todo:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function toggleTodo(id: string, completed: boolean) {
  const supabase = createClient();
  const { error } = await supabase
    .from("todos")
    .update({ completed })
    .eq("id", id);

  if (error) {
    console.error("Error updating todo:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function deleteTodo(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("todos").delete().eq("id", id);

  if (error) {
    console.error("Error deleting todo:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function updateTodo(id: string, title: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("todos")
    .update({ title })
    .eq("id", id);

  if (error) {
    console.error("Error updating todo:", error);
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
