import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogsService } from "@/services/blogsService";
import { Blog } from "@/types";

export function useBlogs() {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: blogsService.getBlogs,
  });
}

export function useBlog(id: string) {
  return useQuery({
    queryKey: ["blogs", id],
    queryFn: () => blogsService.getBlogById(id),
    enabled: !!id && id !== "new",
  });
}

export function useSaveBlog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (blog: Partial<Blog>) => blogsService.saveBlog(blog),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.setQueryData(["blogs", data.id], data);
    },
  });
}
