import { MediaAsset } from "@/types";
import { mockMedia } from "@/mocks/media.mock";

let media = [...mockMedia];
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mediaService = {
  getMedia: async (): Promise<MediaAsset[]> => {
    await delay(500);
    return [...media];
  },
  uploadMedia: async (file: File): Promise<MediaAsset> => {
    await delay(1000);
    const newAsset: MediaAsset = {
      id: `M-${Date.now()}`,
      name: file.name,
      url: URL.createObjectURL(file), // mock URL
      type: file.type,
      size: file.size,
      uploaded_at: new Date().toISOString(),
    };
    media.unshift(newAsset);
    return newAsset;
  }
};
