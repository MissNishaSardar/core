import ProjectList from "@/components/Projects/ProjectList";

type PageProps = { params: Promise<{ slug: string }> };

const WorkspacePage = async ({ params }: PageProps) => {
  const { slug } = await params;
  return (
    <div className="p-6">
      <ProjectList slug={slug} />
    </div>
  );
};

export default WorkspacePage;
