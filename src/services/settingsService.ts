import { Settings } from "@/types";
import { mockSettings } from "@/mocks/settings.mock";

let settings = { ...mockSettings };
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const settingsService = {
  getSettings: async (): Promise<Settings> => {
    await delay(500);
    return { ...settings };
  },
  updateSettings: async (newSettings: Partial<Settings>): Promise<Settings> => {
    await delay(600);
    settings = { ...settings, ...newSettings } as Settings;
    return { ...settings };
  }
};
