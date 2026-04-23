import { TeamMember } from "@/types";
import { mockTeam } from "@/mocks/team.mock";

let team = [...mockTeam];
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const teamService = {
  getTeam: async (): Promise<TeamMember[]> => {
    await delay(500);
    return [...team];
  }
};
