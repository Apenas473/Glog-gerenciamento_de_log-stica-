import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Building2, MapPin, Package, UserCircle2, Truck as TruckIcon } from "lucide-react";
import { toast } from "sonner";
import type { TransportStatus } from "@/lib/status";

interface Transport {
  id: string;
  client_id: string;
  driver_id: string | null;
  company: string;
  address: string;
  cargo: string;
  status: TransportStatus;
  pickup_code: string;
  delivery_code: string;
  created_at: string;
}

interface Driver {
  user_id: string;
  full_name: string;
  truck_model: string;
  license_plate: string;
}

export function CarrierDashboard() {
  const [items, setItems] = useState<Transport[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [assignTarget, setAssignTarget] = useState<Transport | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    const ch = supabase
      .channel("carrier-transports")
      .on("postgres_changes", { event: "*", schema: "public", table: "transports" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, []);

  async function load() {
    const [{ data: t, error: e1 }, { data: d, error: e2 }] = await Promise.all([
      supabase.from("transports").select("*").order("created_at", { ascending: false }),
      supabase.from("drivers").select("user_id, full_name, truck_model, license_plate"),
    ]);
    if (e1) toast.error(e1.message);
    if (e2) toast.error(e2.message);
    setItems((t ?? []) as Transport[]);
    setDrivers((d ?? []) as Driver[]);
    setLoading(false);
  }

  async function handleAssign() {
    if (!assignTarget || !selectedDriver) return;
    const { error } = await supabase
      .from("transports")
      .update({ driver_id: selectedDriver, status: "em_transporte", picked_up_at: new Date().toISOString() })
      .eq("id", assignTarget.id);
    if (error) return toast.error(error.message);
    toast.success("Motorista atribuído. Carga em transporte.");
    setAssignTarget(null);
    setSelectedDriver("");
    load();
  }

  const grouped = {
    em_espera: items.filter((i) => i.status === "em_espera"),
    em_transporte: items.filter((i) => i.status === "em_transporte"),
    entregue: items.filter((i) => i.status === "entregue"),
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Gerenciamento de transportes</h1>
        <p className="text-sm text-muted-foreground">
          Atribua motoristas e acompanhe o status de cada entrega.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <StatCard label="Em espera" value={grouped.em_espera.length} tone="waiting" />
        <StatCard label="Em transporte" value={grouped.em_transporte.length} tone="transit" />
        <StatCard label="Entregues" value={grouped.entregue.length} tone="delivered" />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-xl border border-border bg-surface" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-3 font-semibold">Nenhum pedido ainda</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Quando clientes solicitarem transportes, aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => {
            const driver = drivers.find((d) => d.user_id === t.driver_id);
            return (
              <div key={t.id} className="rounded-xl border border-border bg-surface p-5 shadow-sm">
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div className="font-mono text-xs text-muted-foreground">#{t.id.slice(0, 8)}</div>
                  <StatusBadge status={t.status} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium">{t.company}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{t.address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Package className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="line-clamp-2">{t.cargo}</span>
                  </div>
                  {driver && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <UserCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>
                        {driver.full_name} · {driver.truck_model} ({driver.license_plate})
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3 text-xs">
                  <div>
                    <div className="text-muted-foreground">Cód. coleta</div>
                    <div className="font-mono font-semibold">{t.pickup_code}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Cód. entrega</div>
                    <div className="font-mono font-semibold">{t.delivery_code}</div>
                  </div>
                </div>
                {t.status === "em_espera" && (
                  <Button
                    className="mt-4 w-full"
                    size="sm"
                    onClick={() => setAssignTarget(t)}
                    disabled={drivers.length === 0}
                  >
                    <TruckIcon className="mr-2 h-4 w-4" />
                    Atribuir motorista
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {drivers.length === 0 && (
        <p className="mt-6 rounded-md border border-dashed border-border bg-surface p-4 text-center text-sm text-muted-foreground">
          Nenhum motorista cadastrado ainda. Peça aos motoristas para criarem suas contas.
        </p>
      )}

      <Dialog open={!!assignTarget} onOpenChange={(o) => !o && setAssignTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Atribuir motorista</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Motorista</Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um motorista" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((d) => (
                  <SelectItem key={d.user_id} value={d.user_id}>
                    {d.full_name} · {d.truck_model} ({d.license_plate})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleAssign} disabled={!selectedDriver}>
              Confirmar atribuição
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: "waiting" | "transit" | "delivered" }) {
  const colors = {
    waiting: "border-l-status-waiting",
    transit: "border-l-status-transit",
    delivered: "border-l-status-delivered",
  };
  return (
    <div className={`rounded-xl border border-border border-l-4 ${colors[tone]} bg-surface p-4`}>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
    </div>
  );
}
