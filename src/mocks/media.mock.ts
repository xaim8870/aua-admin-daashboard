import { MediaAsset } from "../types";

export const mockMedia: MediaAsset[] = [
  {
    id: "M-001",
    name: "hero-bg.jpg",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80",
    type: "image/jpeg",
    size: 1024000,
    uploaded_at: new Date().toISOString(),
  },
  {
    id: "M-002",
    name: "logo.png",
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
    type: "image/png",
    size: 250000,
    uploaded_at: new Date(Date.now() - 86400000).toISOString(),
  }
];
