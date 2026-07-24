"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/shadcnui/avatar";
import { Button } from "@/components/shadcnui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/shadcnui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/shadcnui/select";
import { Skeleton } from "@/components/shadcnui/skeleton";
import { toast } from "react-toastify";
import { XIcon, ShieldIcon, UserIcon } from "lucide-react";

const roleBadge = (role: string) => {
  const styles: Record<string, string> = {
    owner: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    member: "bg-muted text-muted-foreground",
  };
  return styles[role] ?? styles.member;
};

type MemberWithUser = {
  id: string;
  role: string;
  userId: string;
  user: { id: string; name: string; email: string; image?: string | null };
};

const MemberList = () => {
  const [members, setMembers] = useState<MemberWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentRole, setCurrentRole] = useState<string>("");

  useEffect(() => {
    const fetch = async () => {
      const [membersRes, sessionRes, roleRes] = await Promise.all([
        authClient.organization.listMembers(),
        authClient.getSession(),
        authClient.organization.getActiveMemberRole(),
      ]);
      if (membersRes.data) setMembers(membersRes.data.members as MemberWithUser[]);
      if (sessionRes.data?.user.id) setCurrentUserId(sessionRes.data.user.id);
      if (roleRes.data?.role) setCurrentRole(roleRes.data.role);
      setLoading(false);
    };
    fetch();
  }, []);

  const canManage = currentRole === "owner" || currentRole === "admin";

  const handleRemove = async (memberId: string) => {
    const { error } = await authClient.organization.removeMember({
      memberIdOrEmail: memberId,
    });
    if (error) {
      toast.error(error.message ?? "Failed to remove member");
    } else {
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
      toast.success("Member removed");
    }
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    const { error } = await authClient.organization.updateMemberRole({
      memberId,
      role: newRole,
    });
    if (error) {
      toast.error(error.message ?? "Failed to update role");
    } else {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
      toast.success("Role updated");
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members ({members.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2 hover:bg-muted/50"
            >
              <Avatar size="sm">
                {member.user.image && <AvatarImage src={member.user.image} />}
                <AvatarFallback>
                  {(member.user.name ?? "?").charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {member.user.name}
                  {member.userId === currentUserId && (
                    <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground truncate">{member.user.email}</p>
              </div>

              {canManage && member.role !== "owner" ? (
                <Select
                  value={member.role}
                  onValueChange={(val) => val && handleRoleChange(member.id, val)}
                >
                  <SelectTrigger className="h-7 w-24 text-xs gap-0.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge(member.role)}`}
                >
                  {member.role === "owner" && <ShieldIcon className="size-3" />}
                  {member.role === "member" && <UserIcon className="size-3" />}
                  {member.role}
                </span>
              )}

              {canManage && member.role !== "owner" && (
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleRemove(member.id)}
                  title="Remove member"
                >
                  <XIcon className="size-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export { MemberList };
