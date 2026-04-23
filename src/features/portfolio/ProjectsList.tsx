import { usePortfolio } from "./usePortfolio";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import { Link, useLocation } from "wouter";

export function ProjectsList() {
  const { data: projects, isLoading, error, refetch } = usePortfolio();
  const [, setLocation] = useLocation();

  if (error) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Portfolio Projects" description="Manage your showcase portfolio.">
        <Button asChild>
          <Link href="/dashboard/portfolio/new">
            <Plus className="mr-2 h-4 w-4" /> Create Project
          </Link>
        </Button>
      </PageHeader>

      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState type="table" />
        ) : projects?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No projects found. Create one to get started.</div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects?.map(project => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      {project.cover_image && (
                        <div className="w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                          <img src={project.cover_image} alt={project.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <div>{project.title}</div>
                        <div className="text-xs text-muted-foreground font-normal truncate max-w-[200px]">{project.short_description}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{project.client_name}</TableCell>
                  <TableCell>{project.industry}</TableCell>
                  <TableCell>
                    <StatusBadge status={project.status} />
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setLocation(`/dashboard/portfolio/${project.id}`)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
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
