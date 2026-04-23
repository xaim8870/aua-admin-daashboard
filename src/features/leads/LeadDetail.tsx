import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { StatusBadge } from "@/components/StatusBadge";
import { leadsService } from "@/services/leadsService";
import { Lead } from "@/types";
import { formatDateTime } from "@/lib/formatters";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

export function LeadDetail() {
  const [, params] = useRoute("/dashboard/leads/:id");
  const [, setLocation] = useLocation();

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leadId = params?.id;

  const fetchLead = async () => {
    if (!leadId) {
      setError("Lead id is missing.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const data = await leadsService.getLeadById(leadId);

      if (!data) {
        setError("Lead not found.");
        setLead(null);
        return;
      }

      setLead(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load lead.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [leadId]);

  const handleStatusChange = async (status: Lead["status"]) => {
    if (!lead) return;

    try {
      setIsUpdating(true);
      const updatedLead = await leadsService.updateLeadStatus(lead.id, status);
      setLead(updatedLead);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update lead status.";
      setError(message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <LoadingState type="detail" />;
  }

  if (error || !lead) {
    return (
      <ErrorState
        title="Unable to load lead"
        description={error || "Lead not found."}
        onRetry={fetchLead}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <PageHeader
          title={lead.full_name}
          description="Lead details and status management."
        />
        <Button variant="outline" onClick={() => setLocation("/dashboard/leads")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Leads
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lead Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p className="font-medium">{lead.full_name || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{lead.email || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{lead.phone || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Company</p>
              <p className="font-medium">{lead.company || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Form Type</p>
              <p className="font-medium capitalize">{lead.form_type || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Source Page</p>
              <p className="font-medium">{lead.source_page || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Service Interest</p>
              <p className="font-medium">{lead.service_interest || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Budget Range</p>
              <p className="font-medium">{lead.budget_range || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Timeline</p>
              <p className="font-medium">{lead.timeline || "-"}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDateTime(lead.created_at)}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">Project Description</p>
              <p className="font-medium whitespace-pre-wrap">
                {lead.message || "-"}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">
                Additional Details
              </p>
              <p className="font-medium whitespace-pre-wrap">
                {lead.additional_details || "-"}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Current Status
                </p>
                <StatusBadge status={lead.status} />
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Update Status
                </p>
                <Select
                  value={lead.status}
                  onValueChange={(value) =>
                    handleStatusChange(value as Lead["status"])
                  }
                  disabled={isUpdating}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isUpdating && (
                <p className="text-sm text-muted-foreground">
                  Updating status...
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground italic">
                Notes are not implemented yet in the backend.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}