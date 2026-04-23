import { ChatSession } from "../types";

export const mockChats: ChatSession[] = [
  {
    id: "C-001",
    visitor_name: "John Doe",
    visitor_email: "john@example.com",
    visitor_phone: "+1 555 000 1111",
    source_page: "/pricing",
    status: "new",
    assigned_to: null,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    messages: [
      {
        id: "M-001",
        sender_type: "visitor",
        text: "Hi, do you offer discounts for non-profits?",
        sent_to_whatsapp: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      }
    ]
  },
  {
    id: "C-002",
    visitor_name: "Sarah Williams",
    visitor_email: "sarah@startup.io",
    visitor_phone: "+1 555 222 3333",
    source_page: "/services/seo",
    status: "open",
    assigned_to: "U-123",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      {
        id: "M-002",
        sender_type: "visitor",
        text: "Hello, I want to improve my site ranking.",
        sent_to_whatsapp: false,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: "M-003",
        sender_type: "admin",
        text: "Hi Sarah, we can certainly help with that. Could you share your website URL?",
        sent_to_whatsapp: false,
        created_at: new Date(Date.now() - 86000000).toISOString(),
      }
    ]
  }
];
