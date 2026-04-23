export type Role = "admin" | "chat_team" | "content_team";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "spam";

export interface Lead {
  id: string;
  form_type: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  message: string;
  source_page?: string | null;
  status: LeadStatus;
  assigned_to?: string | null;
  created_at: string;
  updated_at: string;
  service_interest?: string | null;
  budget_range?: string | null;
  timeline?: string | null;
  additional_details?: string | null;
}

export interface ChatMessage {
  id: string;
  sender_type: "visitor" | "admin" | "system";
  text: string;
  sent_to_whatsapp: boolean;
  created_at: string;
}

export interface ChatSession {
  id: string;
  visitor_name: string;
  visitor_email: string;
  visitor_phone: string;
  source_page: string;
  status: "new" | "open" | "contacted" | "closed" | "spam";
  assigned_to: string | null;
  created_at: string;
  messages: ChatMessage[];
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  seo_title: string;
  seo_description: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

export interface PortfolioProject {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  cover_image: string;
  gallery_images: string[];
  technologies: string[];
  services: string[];
  client_name: string;
  industry: string;
  project_url: string;
  featured: boolean;
  status: "draft" | "published";
  sort_order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "active" | "invited" | "disabled";
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploaded_at: string;
}

export interface Settings {
  official_email: string;
  whatsapp_target_number: string;
  notification_preferences: {
    email_on_new_lead: boolean;
    email_on_new_chat: boolean;
    daily_digest: boolean;
  };
}