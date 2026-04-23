import { useEffect } from "react";
import { useProject, useSaveProject } from "./usePortfolio";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  short_description: z.string().min(1, "Short description required"),
  full_description: z.string().min(1, "Full description required"),
  cover_image: z.string().url("Must be a valid URL").or(z.literal("")),
  client_name: z.string(),
  industry: z.string(),
  project_url: z.string(),
  featured: z.boolean(),
  status: z.enum(["draft", "published"]),
  technologies: z.string().transform(str => str.split(',').map(s => s.trim()).filter(Boolean)),
  services: z.string().transform(str => str.split(',').map(s => s.trim()).filter(Boolean)),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

export function ProjectEditor() {
  const [, params] = useRoute("/dashboard/portfolio/:id");
  const [, setLocation] = useLocation();
  const id = params?.id || "";
  const isNew = id === "new";
  
  const { data: project, isLoading, error } = useProject(id);
  const saveProject = useSaveProject();

  const form = useForm<any>({ // using any for form to simplify transform handling in defaults
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      short_description: "",
      full_description: "",
      cover_image: "",
      client_name: "",
      industry: "",
      project_url: "",
      featured: false,
      status: "draft",
      technologies: "",
      services: "",
    },
  });

  useEffect(() => {
    if (project && !isNew) {
      form.reset({
        title: project.title,
        slug: project.slug,
        short_description: project.short_description,
        full_description: project.full_description,
        cover_image: project.cover_image,
        client_name: project.client_name,
        industry: project.industry,
        project_url: project.project_url,
        featured: project.featured,
        status: project.status,
        technologies: project.technologies.join(", "),
        services: project.services.join(", "),
      });
    }
  }, [project, isNew, form]);

  if (!isNew && isLoading) return <div className="p-6"><LoadingState type="detail" /></div>;
  if (!isNew && error) return <div className="p-6"><ErrorState /></div>;

  const onSubmit = (data: any) => {
    saveProject.mutate({ ...data, id: isNew ? undefined : id }, {
      onSuccess: () => {
        toast.success(isNew ? "Project created successfully" : "Project updated successfully");
        setLocation("/dashboard/portfolio");
      },
      onError: () => toast.error("Failed to save project")
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/portfolio"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <PageHeader 
            title={isNew ? "Create Project" : "Edit Project"} 
          />
        </div>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={saveProject.isPending}>
          <Save className="h-4 w-4 mr-2" /> Save Project
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter title" {...field} />
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
                            <Input placeholder="project-slug" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="short_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="One sentence summary..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="full_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description (HTML)</FormLabel>
                        <FormControl>
                          <Textarea className="min-h-[200px] font-mono text-sm" placeholder="<p>Full case study...</p>" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold mb-2">Metadata</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="client_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="technologies"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technologies (comma separated)</FormLabel>
                          <FormControl>
                            <Input placeholder="React, Node, AWS..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="services"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Services (comma separated)</FormLabel>
                          <FormControl>
                            <Input placeholder="Web Design, Backend..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
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
                        <FormLabel>Status</FormLabel>
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
                  
                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Featured</FormLabel>
                          <div className="text-sm text-muted-foreground">Show on homepage</div>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 space-y-4">
                  <FormField
                    control={form.control}
                    name="cover_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.watch("cover_image") && (
                    <div className="mt-4 rounded-md overflow-hidden border aspect-video bg-muted flex items-center justify-center">
                      <img 
                        src={form.watch("cover_image")} 
                        alt="Preview" 
                        className="object-cover w-full h-full"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                  )}
                  
                  <FormField
                    control={form.control}
                    name="project_url"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Live Project URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
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
