import { TeamMember } from "../types";

export const mockTeam: TeamMember[] = [
  {
    id: "U-001",
    name: "Admin User",
    email: "admin@aua.com",
    role: "admin",
    status: "active",
  },
  {
    id: "U-002",
    name: "Chat Agent",
    email: "agent@aua.com",
    role: "chat_team",
    status: "active",
  },
  {
    id: "U-003",
    name: "Content Editor",
    email: "editor@aua.com",
    role: "blog_portfolio_team",
    status: "active",
  }
];
