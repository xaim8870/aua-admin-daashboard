import { PortfolioProject } from "../types";

export const mockPortfolio: PortfolioProject[] = [
  {
    id: "P-001",
    title: "FinTech Dashboard App",
    slug: "fintech-dashboard-app",
    short_description: "A comprehensive dashboard for a leading financial institution.",
    full_description: "<p>Detailed case study...</p>",
    cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
    gallery_images: [],
    technologies: ["React", "TypeScript", "Tailwind CSS"],
    services: ["Web App Development", "UI/UX Design"],
    client_name: "FinBank Corp",
    industry: "Finance",
    project_url: "https://example.com",
    featured: true,
    status: "published",
    sort_order: 1,
  }
];
