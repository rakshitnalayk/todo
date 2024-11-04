"use client";

import { useState } from "react";
import { Sparkles, Share2, FolderOpen, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <Card key={todo.id} className="p-4">
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="mt-1.5"
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className={cn(
                    "font-medium",
                    todo.completed && "line-through text-muted-foreground"
                  )}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-sm text-muted-foreground">
                      {todo.description}
                    </p>
                  )}
                </div>
                <Badge className={getPriorityColor(todo.priority)}>
                  {todo.priority}
                </Badge>
              </div>

              {(todo.folder || todo.tags.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {todo.folder && (
                    <Badge variant="outline">
                      <FolderOpen className="mr-1 h-3 w-3" />
                      {todo.folder.name}
                    </Badge>
                  )}
                  {todo.tags.map((tag) => (
                    <Badge key={tag.name} variant="secondary">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}

              {todo.image && (
                <div className="space-y-2">
                  <img
                    src={todo.image}
                    alt="Task attachment"
                    className="max-h-40 rounded-md"
                  />
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Sparkles className="mr-2 h-4 w-4" />
                          AI Analysis
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>AI Insights</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Suggested Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {todo.tags.map((tag) => (
                                <Badge key={tag.name} variant="secondary">
                                  {tag.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}