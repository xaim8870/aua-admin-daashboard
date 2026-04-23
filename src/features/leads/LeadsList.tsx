// src/features/leads/LeadsList.tsx
import { useState } from "react";
import { useLeads } from "./useLeads";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime, formatCurrency } from "@/lib/formatters";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { useLocation } from "wouter";

export function LeadsList() {
  const { data: leads, isLoading, error, refetch } = useLeads();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [, setLocation] = useLocation();

  if (error) return <ErrorState onRetry={refetch} />;

  const filteredLeads = leads?.filter((lead) => {
  const matchesSearch =
    lead.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (lead.company || "").toLowerCase().includes(search.toLowerCase()) ||
    (lead.email || "").toLowerCase().includes(search.toLowerCase());

  const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  return (
    <div className="space-y-6">
      <PageHeader title="Leads" description="Manage and triage incoming leads." />
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-45 bg-background">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contacted">Contacted</SelectItem>
            <SelectItem value="qualified">Qualified</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="spam">Spam</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <LoadingState type="table" />
        ) : filteredLeads?.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No leads found matching your criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads?.map(lead => (
                  <TableRow 
                    key={lead.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setLocation(`/dashboard/leads/${lead.id}`)}
                  >
                    <TableCell className="font-medium">
                      <div>{lead.full_name}</div>
                      <div className="text-xs text-muted-foreground font-normal">{lead.email}</div>
                    </TableCell>
                    <TableCell>{lead.company || "-"}</TableCell>
                    <TableCell>{lead.service_interest}</TableCell>
                    <TableCell>
                      <StatusBadge status={lead.status} />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {formatDateTime(lead.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
