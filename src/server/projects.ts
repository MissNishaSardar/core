"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

const COLUMNS = ["Backlog", "Todo", "In Progress", "In Review", "Done"];

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return null;
  return session;
}

export async function createProject(slug: string, name: string, description?: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const org = await prisma.organization.findUnique({ where: { slug } });
  if (!org) return { error: "Organization not found" };

  const project = await prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: { name, description, organizationId: org.id },
    });
    await tx.column.createMany({
      data: COLUMNS.map((name, i) => ({ name, position: i, projectId: project.id })),
    });
    return project;
  });

  revalidatePath(`/dashboard/${slug}`);
  return { project, error: null };
}

export async function getProjects(slug: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const org = await prisma.organization.findUnique({ where: { slug } });
  if (!org) return { error: "Organization not found" };

  const projects = await prisma.project.findMany({
    where: { organizationId: org.id, status: "active" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { tasks: true } } },
  });

  return { projects, error: null };
}

export async function getProject(projectId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      columns: {
        orderBy: { position: "asc" },
        include: {
          tasks: {
            orderBy: { position: "asc" },
            include: { assignee: { select: { id: true, name: true, image: true } } },
          },
        },
      },
    },
  });

  if (!project) return { error: "Project not found" };

  const slug = await prisma.organization.findUnique({ where: { id: project.organizationId }, select: { slug: true } });

  return { project, slug: slug?.slug, error: null };
}

export async function archiveProject(projectId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { organization: { select: { slug: true } } } });
  if (!project) return { error: "Project not found" };

  await prisma.project.update({ where: { id: projectId }, data: { status: "archived" } });

  revalidatePath(`/dashboard/${project.organization.slug}`);
  return { error: null };
}

export async function deleteProject(projectId: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const project = await prisma.project.findUnique({ where: { id: projectId }, select: { organization: { select: { slug: true } } } });
  if (!project) return { error: "Project not found" };

  await prisma.project.delete({ where: { id: projectId } });

  revalidatePath(`/dashboard/${project.organization.slug}`);
  return { error: null };
}
