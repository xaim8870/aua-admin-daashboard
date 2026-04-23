import { useLeads } from "@/features/leads/useLeads";
import { useChats } from "@/features/chats/useChats";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { Users, MessageSquare, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDateTime } from "@/lib/formatters";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function DashboardHome() {
  const { data: leads, isLoading: loadingLeads, error: errorLeads, refetch: refetchLeads } = useLeads();
  const { data: chats, isLoading: loadingChats, error: errorChats, refetch: refetchChats } = useChats();

  if (errorLeads || errorChats) {
    return <ErrorState onRetry={() => { refetchLeads(); refetchChats(); }} />;
  }

  const newLeads = leads?.filter(l => l.status === "new").length || 0;
  const openChats = chats?.filter(c => c.status === "new" || c.status === "open").length || 0;
  const totalLeads = leads?.length || 0;
  const totalChats = chats?.length || 0;

  const recentLeads = leads?.slice(0, 5) || [];
  const recentChats = chats?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Dashboard Overview" 
        description="Welcome back. Here's what's happening today."
      />

      {(loadingLeads || loadingChats) ? (
        <LoadingState type="cards" count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="New Leads"
            value={newLeads}
            icon={Users}
            trend="+12% from last week"
          />
          <StatCard
            title="Open Chats"
            value={openChats}
            icon={MessageSquare}
            trend="+4% from last week"
          />
          <StatCard
            title="Total Leads"
            value={totalLeads}
            icon={TrendingUp}
            description="All time leads generated"
          />
          <StatCard
            title="Total Chats"
            value={totalChats}
            icon={AlertCircle}
            description="All time chat sessions"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Leads</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/leads">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingLeads ? (
              <LoadingState type="table" count={3} />
            ) : recentLeads.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">No leads found.</div>
            ) : (
              <div className="space-y-4">
                {recentLeads.map(lead => (
                  <Link key={lead.id} href={`/dashboard/leads/${lead.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">{lead.full_name}</span>
                        <span className="text-xs text-muted-foreground">{lead.company}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground hidden sm:inline-block">
                          {formatDateTime(lead.created_at)}
                        </span>
                        <StatusBadge status={lead.status} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Chats</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/chats">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {loadingChats ? (
              <LoadingState type="table" count={3} />
            ) : recentChats.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">No chats found.</div>
            ) : (
              <div className="space-y-4">
                {recentChats.map(chat => (
                  <Link key={chat.id} href={`/dashboard/chats/${chat.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-sm">{chat.visitor_name}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {chat.messages[chat.messages.length - 1]?.text || "No messages"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground hidden sm:inline-block">
                          {formatDateTime(chat.created_at)}
                        </span>
                        <StatusBadge status={chat.status} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
