import { Role } from "@/types";

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
  admin: [
    "dashboard",
    "leads",
    "chats",
    "blogs",
    "portfolio",
    "media",
    "team",
    "settings",
  ],
  chat_team: ["dashboard", "leads", "chats"],
  content_team: ["dashboard", "blogs", "portfolio", "media"],
};