import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { portfolioService } from "@/services/portfolioService";
import { PortfolioProject } from "@/types";

export function usePortfolio() {
  return useQuery({
    queryKey: ["portfolio"],
    queryFn: portfolioService.getProjects,
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["portfolio", id],
    queryFn: () => portfolioService.getProjectById(id),
    enabled: !!id && id !== "new",
  });
}

export function useSaveProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: Partial<PortfolioProject>) => portfolioService.saveProject(project),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["portfolio"] });
      queryClient.setQueryData(["portfolio", data.id], data);
    },
  });
}
