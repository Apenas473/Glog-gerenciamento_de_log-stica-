import { createFileRoute, Link } from "@tanstack/react-router";
import { Package, Clock, CheckCircle2, Truck, ArrowRight } from "lucide-react";
import { useStore, roleLabel } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { transportes, role } = useStore();
  const total = transportes.length;
  const entregues = transportes.filter((t) => t.status === "entregue").length;
  const recebidas = transportes.filter((t) => t.status === "recebida").length;
  const espera = transportes.filter((t) => t.status === "em_espera").length;

  const stats = [
    { label: "Total", value: total, icon: Package, color: "bg-primary/10 text-primary" },
    { label: "Em Espera", value: espera, icon: Clock, color: "bg-destructive/10 text-destructive" },
    { label: "Em Andamento", value: recebidas, icon: Truck, color: "bg-warning/15 text-warning-foreground" },
    { label: "Entregues", value: entregues, icon: CheckCircle2, color: "bg-success/10 text-success" },
  ];

  const recentes = transportes.slice(0, 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <p className="text-sm text-muted-foreground">Bem-vindo, {roleLabel[role]}</p>
        <h2 className="text-2xl font-bold tracking-tight">Visão Geral</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <p className="text-3xl font-bold mt-1">{s.value}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Transportes Recentes</h3>
          <Link to="/transportes" className="text-sm text-primary inline-flex items-center gap-1 hover:underline">
            Ver todos <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="space-y-2">
          {recentes.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum transporte registrado.</p>
          )}
          {recentes.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="min-w-0 flex-1">
                <p className="font-medium truncate">{t.empresa}</p>
                <p className="text-xs text-muted-foreground truncate">{t.carga} · {t.endereco}</p>
              </div>
              <StatusBadge status={t.status} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
