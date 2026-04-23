import { useTeam } from "./useTeam";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { StatusBadge } from "@/components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export function TeamPage() {
  const { data: team, isLoading, error, refetch } = useTeam();

  if (error) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Team Management" description="Manage access to the admin dashboard.">
        <Button onClick={() => toast.info("Invite feature coming soon")}>
          <UserPlus className="mr-2 h-4 w-4" /> Invite Member
        </Button>
      </PageHeader>

      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState type="table" />
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team?.map(member => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div>{member.name}</div>
                    <div className="text-xs text-muted-foreground font-normal">{member.email}</div>
                  </TableCell>
                  <TableCell className="capitalize">{member.role.replace(/_/g, ' ')}</TableCell>
                  <TableCell>
                    <StatusBadge status={member.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => toast.info("Edit coming soon")}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
