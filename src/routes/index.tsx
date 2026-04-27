import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { ClientDashboard } from "@/features/client-dashboard";
import { CarrierDashboard } from "@/features/carrier-dashboard";
import { DriverDashboard } from "@/features/driver-dashboard";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" />;

  return (
    <AppShell>
      {role === "cliente" && <ClientDashboard />}
      {role === "transportadora" && <CarrierDashboard />}
      {role === "motorista" && <DriverDashboard />}
      {!role && (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-muted-foreground">Configurando seu perfil…</p>
        </div>
      )}
    </AppShell>
  );
}
