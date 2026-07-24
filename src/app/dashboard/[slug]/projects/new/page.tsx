import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";
import { Button } from "@/components/shadcnui/button";
import CreateProjectForm from "@/components/Projects/CreateProjectForm";

type PageProps = { params: Promise<{ slug: string }> };

const NewProjectPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  return (
    <div className="p-6">
      <Button variant="ghost" className="mb-4" render={<Link href={`/dashboard/${slug}`} />}>
        <ChevronLeftIcon />
        Back to projects
      </Button>
      <h1 className="mb-6 text-2xl font-bold">New Project</h1>
      <CreateProjectForm slug={slug} />
    </div>
  );
};

export default NewProjectPage;
