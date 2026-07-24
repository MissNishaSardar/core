"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createTask(columnId: string, title: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const column = await prisma.column.findUnique({
    where: { id: columnId },
    select: { projectId: true, _count: { select: { tasks: true } } },
  });
  if (!column) return { error: "Column not found" };

  const task = await prisma.task.create({
    data: { title, columnId, projectId: column.projectId, position: column._count.tasks },
  });

  revalidatePath(`/dashboard/${column.projectId}`);
  return { task, error: null };
}

export async function updateTask(
  taskId: string,
  data: { title?: string; description?: string | null; assigneeId?: string | null; dueDate?: Date | null },
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const task = await prisma.task.update({ where: { id: taskId }, data });

  return { task, error: null };
}

export async function moveTask(taskId: string, newColumnId: string, newPosition: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const task = await prisma.task.findUnique({ where: { id: taskId }, select: { projectId: true } });
  if (!task) return { error: "Task not found" };

  await prisma.task.update({ where: { id: taskId }, data: { columnId: newColumnId, position: newPosition } });

  revalidatePath(`/dashboard/${task.projectId}`);
  return { error: null };
}

export async function deleteTask(taskId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { error: "Unauthorized" };

  const task = await prisma.task.findUnique({ where: { id: taskId }, select: { projectId: true } });
  if (!task) return { error: "Task not found" };

  await prisma.task.delete({ where: { id: taskId } });

  revalidatePath(`/dashboard/${task.projectId}`);
  return { error: null };
}
