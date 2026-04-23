import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaService } from "@/services/mediaService";

export function useMedia() {
  return useQuery({
    queryKey: ["media"],
    queryFn: mediaService.getMedia,
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (file: File) => mediaService.uploadMedia(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
}
