import { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Truck, LogOut } from "lucide-react";

const ROLE_LABEL = {
  cliente: "Cliente",
  transportadora: "Transportadora",
  motorista: "Motorista",
} as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate({ to: "/auth" });
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight">LogiFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            {role && (
              <span className="hidden rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground sm:inline">
                {ROLE_LABEL[role]}
              </span>
            )}
            <span className="hidden text-sm text-muted-foreground md:inline">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
