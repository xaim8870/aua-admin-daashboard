import { useEffect } from "react";
import { useBlog, useSaveBlog } from "./useBlogs";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useRoute, useLocation } from "wouter";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  featured_image: z.string().url("Must be a valid URL").or(z.literal("")),
  status: z.enum(["draft", "published"]),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export function BlogEditor() {
  const [, params] = useRoute("/dashboard/blogs/:id");
  const [, setLocation] = useLocation();
  const id = params?.id || "";
  const isNew = id === "new";
  
  const { data: blog, isLoading, error } = useBlog(id);
  const saveBlog = useSaveBlog();

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      featured_image: "",
      status: "draft",
      seo_title: "",
      seo_description: "",
    },
  });

  useEffect(() => {
    if (blog && !isNew) {
      form.reset({
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt,
        content: blog.content,
        featured_image: blog.featured_image,
        status: blog.status,
        seo_title: blog.seo_title,
        seo_description: blog.seo_description,
      });
    }
  }, [blog, isNew, form]);

  if (!isNew && isLoading) return <div className="p-6"><LoadingState type="detail" /></div>;
  if (!isNew && error) return <div className="p-6"><ErrorState /></div>;

  const onSubmit = (data: BlogFormValues) => {
    saveBlog.mutate({ ...data, id: isNew ? undefined : id }, {
      onSuccess: () => {
        toast.success(isNew ? "Blog created successfully" : "Blog updated successfully");
        setLocation("/dashboard/blogs");
      },
      onError: () => toast.error("Failed to save blog")
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/blogs"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <PageHeader 
            title={isNew ? "Create New Blog" : "Edit Blog"} 
          />
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={saveBlog.isPending}>
          <Save className="h-4 w-4 mr-2" /> Save Blog
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter blog title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="my-awesome-blog-post" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content (HTML/Markdown)</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[300px] font-mono text-sm" placeholder="<p>Start writing...</p>" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold mb-2">SEO Meta Data</h3>
                  <FormField
                    control={form.control}
                    name="seo_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seo_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publish Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="featured_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("featured_image") && (
                    <div className="mt-4 rounded-md overflow-hidden border aspect-video bg-muted flex items-center justify-center">
                      <img 
                        src={form.watch("featured_image")} 
                        alt="Preview" 
                        className="object-cover w-full h-full"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[100px]" placeholder="Short summary..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
