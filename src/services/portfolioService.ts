import { PortfolioProject } from "@/types";
import { mockPortfolio } from "@/mocks/portfolio.mock";

let portfolio = [...mockPortfolio];
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const portfolioService = {
  getProjects: async (): Promise<PortfolioProject[]> => {
    await delay(500);
    return [...portfolio];
  },
  getProjectById: async (id: string): Promise<PortfolioProject | null> => {
    await delay(300);
    const project = portfolio.find(p => p.id === id);
    return project ? { ...project } : null;
  },
  saveProject: async (project: Partial<PortfolioProject>): Promise<PortfolioProject> => {
    await delay(600);
    if (project.id) {
      const index = portfolio.findIndex(p => p.id === project.id);
      if (index > -1) {
        portfolio[index] = { ...portfolio[index], ...project } as PortfolioProject;
        return { ...portfolio[index] };
      }
    }
    const newProject: PortfolioProject = {
      ...project,
      id: `P-${Date.now()}`,
    } as PortfolioProject;
    portfolio.unshift(newProject);
    return newProject;
  }
};
