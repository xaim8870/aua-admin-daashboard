import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { chatsService } from "@/services/chatsService";
import { ChatSession } from "@/types";

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: chatsService.getChats,
  });
}

export function useChat(id: string) {
  return useQuery({
    queryKey: ["chats", id],
    queryFn: () => chatsService.getChatById(id),
    enabled: !!id,
  });
}

export function useUpdateChatStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ChatSession["status"] }) => 
      chatsService.updateChatStatus(id, status),
    onSuccess: (data) => {
      queryClient.setQueryData(["chats"], (old: ChatSession[] | undefined) => {
        if (!old) return old;
        return old.map(chat => chat.id === data.id ? data : chat);
      });
      queryClient.setQueryData(["chats", data.id], data);
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ chatId, text }: { chatId: string; text: string }) => 
      chatsService.sendMessage(chatId, text),
    onSuccess: (data) => {
      queryClient.setQueryData(["chats"], (old: ChatSession[] | undefined) => {
        if (!old) return old;
        return old.map(chat => chat.id === data.id ? data : chat);
      });
      queryClient.setQueryData(["chats", data.id], data);
    },
  });
}
