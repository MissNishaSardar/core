import { auth } from "@/lib/auth";
import prisma from "@/lib/database/dbClient";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import ProjectBoard from "@/components/Projects/ProjectBoard";

type PageProps = { params: Promise<{ id: string }> };

const ProjectPage = async ({ params }: PageProps) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/login");

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
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

  if (!project) redirect("/dashboard/home");

  const serialized = {
    ...project,
    columns: project.columns.map((c) => ({
      ...c,
      tasks: c.tasks.map((t) => ({
        ...t,
        dueDate: t.dueDate?.toISOString() ?? null,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
    })),
  };

  return (
    <div className="p-6">
      <ProjectBoard initialProject={serialized} projectId={id} />
    </div>
  );
};

export default ProjectPage;
