import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/features/auth/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleGuard } from "@/routes/RoleGuard";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import NotFound from "@/pages/not-found";

import { Login } from "@/features/auth/Login";
import { DashboardHome } from "@/features/dashboard/DashboardHome";
import { LeadsList } from "@/features/leads/LeadsList";
import { LeadDetail } from "@/features/leads/LeadDetail";
import { ChatInbox } from "@/features/chats/ChatInbox";
import { BlogsList } from "@/features/blogs/BlogsList";
import { BlogEditor } from "@/features/blogs/BlogEditor";
import { ProjectsList } from "@/features/portfolio/ProjectsList";
import { ProjectEditor } from "@/features/portfolio/ProjectEditor";
import { MediaLibrary } from "@/features/media/MediaLibrary";
import { TeamPage } from "@/features/team/TeamPage";
import { SettingsPage } from "@/features/settings/SettingsPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function DashboardPage({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/login" component={Login} />

      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>

      <Route path="/dashboard">
        <DashboardPage>
          <DashboardHome />
        </DashboardPage>
      </Route>

      <Route path="/dashboard/leads">
        <DashboardPage>
          <RoleGuard requiredFeature="leads">
            <LeadsList />
          </RoleGuard>
        </DashboardPage>
      </Route>

      <Route path="/dashboard/leads/:id">
        <DashboardPage>
          <RoleGuard requiredFeature="leads">
            <LeadDetail />
          </RoleGuard>
        </DashboardPage>
      </Route>

      <Route path="/dashboard/chats">
        <DashboardPage>
          <RoleGuard requiredFeature="chats">
            <ChatInbox />
          </RoleGuard>
        </DashboardPage>
      </Route>

      <Route path="/dashboard/chats/:id">
        <DashboardPage>
          <RoleGuard requiredFeature="chats">
            <ChatInbox />
          </RoleGuard>
        </DashboardPage>
      </Route>

      <Route path="/dashboard/blogs">
        <DashboardPage>
          <RoleGuard requiredFeature="blogs">
            <BlogsList />
          </RoleGuard>
        </DashboardPage>
      </Route>

      <Route path="/dashboard/blogs/:id">
        <DashboardPage>
          <RoleGuard requiredFeature="blogs">
            <BlogEditor />
          </RoleGuard>
        </DashboardPage>
      </Route>

      <Route path="/dashboard/portfolio">
        <DashboardPage>
          <RoleGuard requiredFeature="portfolio">
            <ProjectsList />
          </RoleGuard>
        </DashboardPage>
      </Route>

      <Route path="/dashboard/portfolio/:id">
        <DashboardPage>
          <RoleGuard requiredFeature="portfolio">
            <ProjectEditor />
          </RoleGuard>
        </DashboardPage>
      </Route>

      <Route path="/dashboard/media">
        <DashboardPage>
          <RoleGuard requiredFeature="media">
            <MediaLibrary />
          </RoleGuard>
        </DashboardPage>
      </Route>

      <Route path="/dashboard/team">
        <DashboardPage>
          <RoleGuard requiredFeature="team">
            <TeamPage />
          </RoleGuard>
        </DashboardPage>
      </Route>

      <Route path="/dashboard/settings">
        <DashboardPage>
          <RoleGuard requiredFeature="settings">
            <SettingsPage />
          </RoleGuard>
        </DashboardPage>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRouter />
          </WouterRouter>
          <Toaster richColors />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;