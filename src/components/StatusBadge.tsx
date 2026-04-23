import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  new: "default",
  contacted: "secondary",
  qualified: "outline",
  closed: "outline",
  spam: "destructive",
  open: "default",
  active: "default",
  invited: "secondary",
  disabled: "destructive",
  draft: "secondary",
  published: "default"
};

export function StatusBadge({ status }: { status: string }) {
  const variant = statusColors[status] || "default";
  
  return (
    <Badge variant={variant} className="capitalize font-medium">
      {status}
    </Badge>
  );
}
