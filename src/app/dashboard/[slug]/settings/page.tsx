import { TeamSettings } from "@/components/Teams/TeamSettings";

const TeamSettingsPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Team Settings</h1>
      <TeamSettings slug={slug} />
    </div>
  );
};

export default TeamSettingsPage;
