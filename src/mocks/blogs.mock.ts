import { Blog } from "../types";

export const mockBlogs: Blog[] = [
  {
    id: "B-001",
    title: "The Future of Web Development",
    slug: "future-of-web-development",
    excerpt: "Exploring the latest trends in modern web architecture.",
    content: "<p>Content goes here...</p>",
    featured_image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80",
    seo_title: "Future of Web Dev 2024",
    seo_description: "Latest trends in web development.",
    status: "published",
    created_at: new Date(Date.now() - 1000000000).toISOString(),
    updated_at: new Date(Date.now() - 500000000).toISOString(),
  },
  {
    id: "B-002",
    title: "Cloud Migration Strategies",
    slug: "cloud-migration-strategies",
    excerpt: "How to smoothly transition your business to the cloud.",
    content: "<p>More content...</p>",
    featured_image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
    seo_title: "Cloud Migration Guide",
    seo_description: "A comprehensive guide to cloud migration.",
    status: "draft",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];
