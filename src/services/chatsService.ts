import { ChatSession } from "@/types";
import { mockChats } from "@/mocks/chats.mock";

let chats = [...mockChats];
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const chatsService = {
  getChats: async (): Promise<ChatSession[]> => {
    await delay(500);
    return [...chats];
  },
  getChatById: async (id: string): Promise<ChatSession | null> => {
    await delay(300);
    const chat = chats.find(c => c.id === id);
    return chat ? { ...chat } : null;
  },
  updateChatStatus: async (id: string, status: ChatSession["status"]): Promise<ChatSession> => {
    await delay(400);
    const index = chats.findIndex(c => c.id === id);
    if (index === -1) throw new Error("Chat not found");
    chats[index] = { ...chats[index], status };
    return { ...chats[index] };
  },
  sendMessage: async (chatId: string, text: string): Promise<ChatSession> => {
    await delay(400);
    const index = chats.findIndex(c => c.id === chatId);
    if (index === -1) throw new Error("Chat not found");
    
    const newMessage = {
      id: `M-${Date.now()}`,
      sender_type: "admin" as const,
      text,
      sent_to_whatsapp: false,
      created_at: new Date().toISOString()
    };
    
    chats[index] = {
      ...chats[index],
      messages: [...chats[index].messages, newMessage]
    };
    return { ...chats[index] };
  }
};
