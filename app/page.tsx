"use client";

import { useEffect, useState } from "react";
import { TodoForm } from "@/components/todo-form";
import { TodoList } from "@/components/todo-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  image?: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: Date;
  folder?: { name: string };
  tags: { name: string }[];
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.todo) {
        setTodos([result.todo, ...todos]);
        toast({
          title: "Success",
          description: "Task added successfully",
        });

        if (result.reorganization) {
          toast({
            title: "AI Suggestion",
            description: "Would you like to reorganize your folders?",
            action: (
              <Button variant="outline" size="sm">
                <Sparkles className="mr-2 h-4 w-4" />
                Apply
              </Button>
            ),
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      });
    }
  };

  const toggleTodo = async (id: string) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = async (id: string) => {
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
      setTodos(todos.filter(todo => todo.id !== id));
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  const folders = Array.from(new Set(todos.map(todo => todo.folder?.name).filter(Boolean)));

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Tasks & Notes</h1>
          <p className="text-muted-foreground">
            Organize your thoughts with AI-powered insights
          </p>
        </div>

        <TodoForm onSubmit={handleSubmit} />

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {folders.map(folder => (
              <TabsTrigger key={folder} value={folder}>
                {folder}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
            />
          </TabsContent>

          {folders.map(folder => (
            <TabsContent key={folder} value={folder}>
              <TodoList
                todos={todos.filter(todo => todo.folder?.name === folder)}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}