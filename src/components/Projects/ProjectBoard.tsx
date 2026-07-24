"use client";

import { useState, useCallback } from "react";
import { PlusIcon, CalendarIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/shadcnui/button";
import { Input } from "@/components/shadcnui/input";
import { Textarea } from "@/components/shadcnui/textarea";
import { Card, CardContent, CardHeader } from "@/components/shadcnui/card";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/shadcnui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/shadcnui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcnui/avatar";
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
  type KanbanCommitMeta,
} from "@/components/reui/kanban";
import { getProject } from "@/server/projects";
import { createTask, updateTask, moveTask, deleteTask } from "@/server/tasks";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

type Task = {
  id: string;
  title: string;
  description: string | null;
  position: number;
  dueDate: string | null;
  assigneeId: string | null;
  assignee: { id: string; name: string; image: string | null } | null;
};

type Column = {
  id: string;
  name: string;
  position: number;
  tasks: Task[];
};

type Member = { id: string; name: string; image: string | null };

type ProjectBoardProps = {
  initialProject: { name: string; columns: Column[] };
  projectId: string;
};

const ProjectBoard = ({ initialProject, projectId }: ProjectBoardProps) => {
  const [project, setProject] = useState(initialProject);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskTitles, setNewTaskTitles] = useState<Record<string, string>>({});

  const refreshProject = useCallback(async () => {
    const res = await getProject(projectId);
    if (res.error) { toast.error(res.error); return; }
    setProject(res.project as unknown as ProjectBoardProps["initialProject"]);
  }, [projectId]);

  const data = Object.fromEntries(project.columns.map((c) => [c.id, c.tasks]));

  const handleValueCommit = useCallback(
    async (_next: Record<string, Task[]>, meta: KanbanCommitMeta<Task>) => {
      if (meta.kind !== "item") return;
      const result = await moveTask(String(meta.event.active.id), meta.overContainer, meta.overIndex);
      if (result.error) toast.error(result.error);
    },
    [],
  );

  const handleAddTask = async (columnId: string) => {
    const title = newTaskTitles[columnId]?.trim();
    if (!title) return;
    const result = await createTask(columnId, title);
    if (result.error) { toast.error(result.error); return; }
    setNewTaskTitles((prev) => ({ ...prev, [columnId]: "" }));
    refreshProject();
  };

  const loadMembers = useCallback(async () => {
    if (members.length > 0) return;
    const res = await authClient.organization.listMembers();
    if (res.data) {
      setMembers(
        res.data.members.map((m: { userId: string; user: { id: string; name: string; image?: string | null } }) => ({
          id: m.userId,
          name: m.user.name,
          image: m.user.image ?? null,
        })),
      );
    }
  }, [members.length]);

  const openTaskSheet = (task: Task) => {
    setSelectedTask(task);
    setEditingTask({ ...task, dueDate: task.dueDate ?? null });
    loadMembers();
  };

  const handleUpdateTask = async () => {
    if (!editingTask || !selectedTask) return;
    const result = await updateTask(selectedTask.id, {
      title: editingTask.title,
      description: editingTask.description,
      assigneeId: editingTask.assigneeId,
      dueDate: editingTask.dueDate ? new Date(editingTask.dueDate) : null,
    });
    if (result.error) { toast.error(result.error); return; }
    toast.success("Task updated");
    setSelectedTask(null);
    setEditingTask(null);
    refreshProject();
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    const result = await deleteTask(selectedTask.id);
    if (result.error) { toast.error(result.error); return; }
    toast.success("Task deleted");
    setSelectedTask(null);
    setEditingTask(null);
    refreshProject();
  };

  if (!project) {
    return <div className="flex items-center justify-center py-16"><Loader2Icon className="size-6 animate-spin" /></div>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">{project.name}</h1>
      <Kanban value={data} onValueChange={() => {}} getItemValue={(item) => item.id} onValueCommit={handleValueCommit}>
        <KanbanBoard className="flex gap-4 overflow-x-auto pb-4">
          {project.columns.map((column) => (
            <KanbanColumn key={column.id} value={column.id} className="min-w-72 flex-1">
              <Card className="mb-2">
                <CardHeader className="flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{column.name}</span>
                    <span className="text-muted-foreground rounded-sm border px-1.5 text-xs">{column.tasks.length}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <KanbanColumnContent value={column.id} className="flex flex-col gap-2">
                    {column.tasks.map((task) => (
                      <KanbanItem key={task.id} value={task.id}>
                        <KanbanItemHandle>
                          <div
                            className="bg-card cursor-pointer rounded-md border p-3 shadow-xs hover:shadow-sm"
                            onClick={() => openTaskSheet(task)}
                          >
                            <p className="text-sm font-medium">{task.title}</p>
                            {(task.assignee || task.dueDate) && (
                              <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                                {task.assignee && (
                                  <div className="flex items-center gap-1">
                                    <Avatar className="size-4">
                                      <AvatarImage src={task.assignee.image ?? undefined} />
                                      <AvatarFallback>{task.assignee.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <span>{task.assignee.name.split(" ")[0]}</span>
                                  </div>
                                )}
                                {task.dueDate && (
                                  <span className="flex items-center gap-1">
                                    <CalendarIcon className="size-3" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </KanbanItemHandle>
                      </KanbanItem>
                    ))}
                  </KanbanColumnContent>
                  <div className="mt-2">
                    <div className="flex gap-1">
                      <Input
                        placeholder="Add task..."
                        value={newTaskTitles[column.id] ?? ""}
                        onChange={(e) => setNewTaskTitles((p) => ({ ...p, [column.id]: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddTask(column.id); }}
                      />
                      <Button size="icon-sm" onClick={() => handleAddTask(column.id)}>
                        <PlusIcon className="size-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </KanbanColumn>
          ))}
        </KanbanBoard>
        <KanbanOverlay className="bg-muted/10 rounded-md border-2 border-dashed" />
      </Kanban>

      <Sheet open={!!selectedTask} onOpenChange={(open) => { if (!open) { setSelectedTask(null); setEditingTask(null); } }}>
        <SheetContent side="right" className="w-full max-w-md">
          {editingTask && (
            <>
              <SheetHeader>
                <SheetTitle>Edit Task</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={editingTask.title}
                    onChange={(e) => setEditingTask((p) => (p ? { ...p, title: e.target.value } : null))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    rows={4}
                    value={editingTask.description ?? ""}
                    onChange={(e) => setEditingTask((p) => (p ? { ...p, description: e.target.value } : null))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Assignee</label>
                  <Select
                    value={editingTask.assigneeId ?? ""}
                    onValueChange={(val) => setEditingTask((p) => (p ? { ...p, assigneeId: val || null } : null))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {members.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={editingTask.dueDate ? new Date(editingTask.dueDate + "T00:00:00").toISOString().split("T")[0] : ""}
                    onChange={(e) => setEditingTask((p) => (p ? { ...p, dueDate: e.target.value || null } : null))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleUpdateTask}>Save</Button>
                  <Button variant="destructive" onClick={handleDeleteTask}>Delete</Button>
                  <SheetClose render={<Button variant="outline">Cancel</Button>} />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ProjectBoard;
