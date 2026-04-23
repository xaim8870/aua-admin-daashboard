import { useEffect } from "react";
import { useSettings, useUpdateSettings } from "./useSettings";
import { PageHeader } from "@/components/PageHeader";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const settingsSchema = z.object({
  official_email: z.string().email("Invalid email"),
  whatsapp_target_number: z.string().min(1, "Required"),
  notification_preferences: z.object({
    email_on_new_lead: z.boolean(),
    email_on_new_chat: z.boolean(),
    daily_digest: z.boolean(),
  })
});

type SettingsValues = z.infer<typeof settingsSchema>;

export function SettingsPage() {
  const { data: settings, isLoading, error } = useSettings();
  const updateSettings = useUpdateSettings();

  const form = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      official_email: "",
      whatsapp_target_number: "",
      notification_preferences: {
        email_on_new_lead: false,
        email_on_new_chat: false,
        daily_digest: false,
      }
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  if (isLoading) return <div className="p-6"><LoadingState type="detail" /></div>;
  if (error) return <div className="p-6"><ErrorState /></div>;

  const onSubmit = (data: SettingsValues) => {
    updateSettings.mutate(data, {
      onSuccess: () => toast.success("Settings saved successfully"),
      onError: () => toast.error("Failed to save settings")
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <PageHeader title="Global Settings" description="Configure core platform integrations." />
        <Button onClick={form.handleSubmit(onSubmit)} disabled={updateSettings.isPending}>
          <Save className="h-4 w-4 mr-2" /> Save Settings
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Primary contact details used across the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="official_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Official Contact Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Where generic inquiries are sent.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="whatsapp_target_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp Target Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>The number that receives forwarded chats.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Control when the system sends internal alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="notification_preferences.email_on_new_lead"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">New Lead Alerts</FormLabel>
                      <FormDescription>Email admins when a new lead is submitted.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notification_preferences.email_on_new_chat"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">New Chat Alerts</FormLabel>
                      <FormDescription>Email chat team when a new session starts.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notification_preferences.daily_digest"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Daily Digest</FormLabel>
                      <FormDescription>Send a daily summary of all activity.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
