import { Blog } from "@/types";
import { mockBlogs } from "@/mocks/blogs.mock";

let blogs = [...mockBlogs];
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const blogsService = {
  getBlogs: async (): Promise<Blog[]> => {
    await delay(500);
    return [...blogs];
  },
  getBlogById: async (id: string): Promise<Blog | null> => {
    await delay(300);
    const blog = blogs.find(b => b.id === id);
    return blog ? { ...blog } : null;
  },
  saveBlog: async (blog: Partial<Blog>): Promise<Blog> => {
    await delay(600);
    if (blog.id) {
      const index = blogs.findIndex(b => b.id === blog.id);
      if (index > -1) {
        blogs[index] = { ...blogs[index], ...blog, updated_at: new Date().toISOString() } as Blog;
        return { ...blogs[index] };
      }
    }
    const newBlog: Blog = {
      ...blog,
      id: `B-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as Blog;
    blogs.unshift(newBlog);
    return newBlog;
  }
};
