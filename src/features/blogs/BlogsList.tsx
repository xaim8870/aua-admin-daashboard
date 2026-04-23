import { useBlogs, useSaveBlog } from "./useBlogs";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import { Link, useLocation } from "wouter";

export function BlogsList() {
  const { data: blogs, isLoading, error, refetch } = useBlogs();
  const [, setLocation] = useLocation();

  if (error) return <ErrorState onRetry={refetch} />;

  return (
    <div className="space-y-6">
      <PageHeader title="Blogs" description="Manage your website's blog content.">
        <Button asChild>
          <Link href="/dashboard/blogs/new">
            <Plus className="mr-2 h-4 w-4" /> Create Blog
          </Link>
        </Button>
      </PageHeader>

      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState type="table" />
        ) : blogs?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No blogs found. Create one to get started.</div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs?.map(blog => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium">
                    <div>{blog.title}</div>
                    <div className="text-xs text-muted-foreground font-normal">/{blog.slug}</div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={blog.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDateTime(blog.updated_at)}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setLocation(`/dashboard/blogs/${blog.id}`)}>
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
