import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
} from "lucide-react";

import { useStore, roleLabel } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { transportes, role } = useStore();

  const total = transportes.length;

  const emEspera = transportes.filter((t) => t.status === "em_espera").length;
  const atribuidas = transportes.filter((t) => t.status === "atribuida").length;
  const recebidas = transportes.filter((t) => t.status === "recebida").length;
  const entregues = transportes.filter((t) => t.status === "entregue").length;

  const stats = [
    { label: "Total", value: total, icon: Package, color: "bg-primary/10 text-primary" },
    { label: "Em Espera", value: emEspera, icon: Clock, color: "bg-red-100 text-red-600" },
    { label: "Atribuídas", value: atribuidas, icon: Truck, color: "bg-yellow-100 text-yellow-600" },
    { label: "Recebidas", value: recebidas, icon: Truck, color: "bg-blue-100 text-blue-600" },
    { label: "Entregues", value: entregues, icon: CheckCircle2, color: "bg-green-100 text-green-600" },
  ];

  const recentes = [...transportes]
    .sort(
      (a, b) =>
        new Date(b.criado_em).getTime() -
        new Date(a.criado_em).getTime()
    )
    .slice(0, 5);

  const percentualEntrega =
    total > 0
      ? Math.round((entregues / total) * 100)
      : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <p className="text-sm text-muted-foreground">
          Bem-vindo, {roleLabel[role]}
        </p>

        <h2 className="text-3xl font-bold tracking-tight">
          Painel de Acompanhamento
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </p>

                <p className="text-3xl font-bold mt-1">
                  {s.value}
                </p>
              </div>

              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}
              >
                <s.icon className="h-5 w-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">
            Resumo Operacional
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Taxa de Entrega</span>
              <span className="font-bold">
                {percentualEntrega}%
              </span>
            </div>

            <div className="flex justify-between">
              <span>Em Operação</span>
              <span className="font-bold">{atribuidas + recebidas}</span>
            </div>

            <div className="flex justify-between">
              <span>Finalizados</span>
              <span className="font-bold">
                {entregues}
              </span>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              Transportes Recentes
            </h3>

            <Link
              to="/transportes"
              className="text-sm text-primary inline-flex items-center gap-1 hover:underline"
            >
              Ver todos
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {recentes.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Nenhum transporte registrado.
              </p>
            )}

            {recentes.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">
                    {t.empresa}
                  </p>

                  <p className="text-xs text-muted-foreground truncate">
                    {t.carga}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {t.peso} • {t.volume}
                  </p>
                </div>

                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}