import { useAuth } from "@/features/auth/AuthContext";
import { Redirect } from "wouter";
import { ROLE_PERMISSIONS } from "@/lib/constants";

interface RoleGuardProps {
  children: React.ReactNode;
  requiredFeature: string;
}

export function RoleGuard({ children, requiredFeature }: RoleGuardProps) {
  const { role, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect to="/login" />;

  const hasAccess = role && ROLE_PERMISSIONS[role]?.includes(requiredFeature);

  if (!hasAccess) {
    return <Redirect to="/dashboard" />;
  }

  return <>{children}</>;
}
