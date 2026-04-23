import { useQuery } from "@tanstack/react-query";
import { teamService } from "@/services/teamService";

export function useTeam() {
  return useQuery({
    queryKey: ["team"],
    queryFn: teamService.getTeam,
  });
}
