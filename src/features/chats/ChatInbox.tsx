import { useState } from "react";
import { useChats, useSendMessage, useUpdateChatStatus } from "./useChats";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/formatters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Send, User, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoute } from "wouter";
import { ChatSession } from "@/types";

export function ChatInbox() {
  const { data: chats, isLoading, error, refetch } = useChats();
  const [, params] = useRoute("/dashboard/chats/:id");
  const selectedChatId = params?.id || null;
  const [search, setSearch] = useState("");
  
  const sendMessage = useSendMessage();
  const updateStatus = useUpdateChatStatus();
  const [messageText, setMessageText] = useState("");

  if (error) return <ErrorState onRetry={refetch} />;

  const filteredChats = chats?.filter(chat => 
    chat.visitor_name.toLowerCase().includes(search.toLowerCase()) || 
    chat.visitor_email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedChat = chats?.find(c => c.id === selectedChatId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;
    
    sendMessage.mutate({ chatId: selectedChat.id, text: messageText });
    setMessageText("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <PageHeader title="Chat Inbox" description="Manage live conversations." />
      
      <div className="flex flex-1 gap-6 min-h-0 overflow-hidden bg-card border rounded-lg shadow-sm">
        {/* Sidebar List */}
        <div className="w-1/3 border-r flex flex-col bg-muted/10">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="p-4"><LoadingState type="cards" count={3} /></div>
            ) : filteredChats?.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">No chats found.</div>
            ) : (
              <div className="divide-y">
                {filteredChats?.map(chat => (
                  <a 
                    key={chat.id}
                    href={`/dashboard/chats/${chat.id}`}
                    className={`flex flex-col gap-2 p-4 hover:bg-muted/50 transition-colors block ${selectedChatId === chat.id ? 'bg-muted border-l-4 border-l-primary' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm truncate">{chat.visitor_name}</span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatDateTime(chat.created_at).split(' ')[1]}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {chat.messages[chat.messages.length - 1]?.text || "No messages"}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <StatusBadge status={chat.status} />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Conversation Area */}
        <div className="w-2/3 flex flex-col bg-background">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between bg-muted/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{selectedChat.visitor_name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedChat.visitor_email} • {selectedChat.visitor_phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select 
                    value={selectedChat.status} 
                    onValueChange={(val) => updateStatus.mutate({ id: selectedChat.id, status: val as ChatSession["status"] })}
                    disabled={updateStatus.isPending}
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                      <SelectItem value="spam">Spam</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4 pb-4">
                  <div className="text-center text-xs text-muted-foreground my-4">
                    Chat started from {selectedChat.source_page} on {formatDateTime(selectedChat.created_at)}
                  </div>
                  
                  {selectedChat.messages.map((msg) => {
                    const isVisitor = msg.sender_type === "visitor";
                    const isSystem = msg.sender_type === "system";
                    
                    if (isSystem) {
                      return (
                        <div key={msg.id} className="text-center text-xs text-muted-foreground italic my-2">
                          {msg.text}
                        </div>
                      );
                    }
                    
                    return (
                      <div key={msg.id} className={`flex ${isVisitor ? 'justify-start' : 'justify-end'}`}>
                        <div className={`max-w-[75%] rounded-lg p-3 text-sm ${
                          isVisitor 
                            ? 'bg-muted text-foreground rounded-tl-none' 
                            : 'bg-primary text-primary-foreground rounded-tr-none'
                        }`}>
                          <div>{msg.text}</div>
                          <div className={`text-[10px] mt-1 text-right ${isVisitor ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                            {formatDateTime(msg.created_at).split(' ')[1]}
                            {!isVisitor && msg.sent_to_whatsapp && " • Sent to WhatsApp"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>

              {/* Chat Input */}
              <div className="p-4 border-t bg-muted/10">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    className="flex-1"
                    disabled={selectedChat.status === "closed" || sendMessage.isPending}
                  />
                  <Button type="submit" disabled={!messageText.trim() || selectedChat.status === "closed" || sendMessage.isPending}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  Replies are automatically sent to the visitor's email and WhatsApp (if opted in).
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
              <p>Select a chat from the sidebar to view conversation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
