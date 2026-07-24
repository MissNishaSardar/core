"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArchiveIcon, Trash2Icon, PlusIcon, FolderKanbanIcon, Loader2Icon } from "lucide-react";
import { Button } from "@/components/shadcnui/button";
import { getProjects, archiveProject, deleteProject } from "@/server/projects";
import { toast } from "react-toastify";

type Project = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  _count: { tasks: number };
};

type ProjectListProps = {
  slug: string;
};

const ProjectList = ({ slug }: ProjectListProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects(slug).then((res) => {
      if (res.error) { toast.error(res.error); return; }
      setProjects(res.projects ?? []);
      setLoading(false);
    });
  }, [slug]);

  const handleArchive = async (id: string) => {
    const result = await archiveProject(id);
    if (result.error) { toast.error(result.error); return; }
    toast.success("Project archived");
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const handleDelete = async (id: string) => {
    const result = await deleteProject(id);
    if (result.error) { toast.error(result.error); return; }
    toast.success("Project deleted");
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return <div className="flex items-center justify-center py-16"><Loader2Icon className="size-6 animate-spin" /></div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button render={<Link href={`/dashboard/${slug}/projects/new`} />}>
          <PlusIcon />
          New Project
        </Button>
      </div>
      {projects.length === 0 ? (
        <div className="text-muted-foreground flex flex-col items-center gap-4 py-16">
          <FolderKanbanIcon className="size-12" />
          <p className="text-lg">No projects yet</p>
          <Button render={<Link href={`/dashboard/${slug}/projects/new`} />}>
            <PlusIcon />
            Create your first project
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="border-border flex flex-col gap-3 rounded-lg border p-4">
              <div className="flex-1">
                <Link
                  href={`/dashboard/${slug}/projects/${project.id}`}
                  className="text-lg font-semibold hover:underline"
                >
                  {project.name}
                </Link>
                {project.description && (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{project.description}</p>
                )}
              </div>
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span>{project._count.tasks} tasks</span>
                <div className="flex gap-1">
                  <Button size="icon-xs" variant="ghost" onClick={() => handleArchive(project.id)} title="Archive">
                    <ArchiveIcon className="size-3.5" />
                  </Button>
                  <Button size="icon-xs" variant="ghost" onClick={() => handleDelete(project.id)} title="Delete">
                    <Trash2Icon className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
