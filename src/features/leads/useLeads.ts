import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadsService } from "@/services/leadsService";
import { Lead } from "@/types";

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: leadsService.getLeads,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ["leads", id],
    queryFn: () => leadsService.getLeadById(id),
    enabled: !!id,
  });
}

export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Lead["status"] }) => 
      leadsService.updateLeadStatus(id, status),
    onSuccess: (data) => {
      queryClient.setQueryData(["leads"], (old: Lead[] | undefined) => {
        if (!old) return old;
        return old.map(lead => lead.id === data.id ? data : lead);
      });
      queryClient.setQueryData(["leads", data.id], data);
    },
  });
}
