import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { useAuth } from "@/features/auth/AuthContext";
import { ROLE_PERMISSIONS } from "@/lib/constants";
import { Link, useLocation } from "wouter";
import { Home, Users, MessageSquare, FileText, Briefcase, Image as ImageIcon, Settings, LogOut, LayoutDashboard } from "lucide-react";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, role, logout } = useAuth();
  const [location] = useLocation();

  if (!user || !role) return null;

  const allowedFeatures = ROLE_PERMISSIONS[role] || [];

  const navItems = [
    { name: "Overview", icon: Home, path: "/dashboard", feature: "dashboard" },
    { name: "Leads", icon: Users, path: "/dashboard/leads", feature: "leads" },
    { name: "Chats", icon: MessageSquare, path: "/dashboard/chats", feature: "chats" },
    { name: "Blogs", icon: FileText, path: "/dashboard/blogs", feature: "blogs" },
    { name: "Portfolio", icon: Briefcase, path: "/dashboard/portfolio", feature: "portfolio" },
    { name: "Media", icon: ImageIcon, path: "/dashboard/media", feature: "media" },
    { name: "Team", icon: Users, path: "/dashboard/team", feature: "team" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings", feature: "settings" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/40">
        <Sidebar className="border-r border-border/50">
          <SidebarHeader className="h-16 flex items-center px-4 border-b border-border/50">
            <div className="flex items-center gap-2 font-bold text-lg text-primary">
              <LayoutDashboard className="h-5 w-5" />
              <span>AUA Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.filter(item => allowedFeatures.includes(item.feature)).map(item => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={location === item.path || (location.startsWith(item.path) && item.path !== "/dashboard")}>
                        <Link href={item.path} className="flex items-center gap-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-border/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role.replace("_", " ")}</span>
              </div>
              <button onClick={logout} className="text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted" title="Logout">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center justify-between px-6 border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-10">
             <div className="font-medium text-sm text-muted-foreground">Operations Cockpit</div>
          </header>
          <div className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
