import { MemberList } from "@/components/Teams/MemberList";
import { InviteMemberForm } from "@/components/Teams/InviteMemberForm";

const TeamMembersPage = () => (
  <div className="p-6 space-y-6">
    <h1 className="text-2xl font-bold">Team Members</h1>
    <InviteMemberForm />
    <MemberList />
  </div>
);

export default TeamMembersPage;
