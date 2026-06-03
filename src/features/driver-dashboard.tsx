import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Building2, MapPin, Package, ShieldCheck, Truck as TruckIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import type { TransportStatus } from "@/lib/status";

interface Transport {
  id: string;
  company: string;
  address: string;
  cargo: string;
  status: TransportStatus;
  pickup_code: string;
  delivery_code: string;
}

interface Driver {
  full_name: string;
  truck_model: string;
  license_plate: string;
}

const driverSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  truck_model: z.string().trim().min(1).max(80),
  license_plate: z.string().trim().min(4).max(15),
});

export function DriverDashboard() {
  const { user } = useAuth();
  const [driver, setDriver] = useState<Driver | null>(null);
  const [items, setItems] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifyTarget, setVerifyTarget] = useState<Transport | null>(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!user) return;
    init();
    const ch = supabase
      .channel("driver-transports")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transports", filter: `driver_id=eq.${user.id}` },
        () => loadTransports(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user]);

  async function init() {
    if (!user) return;
    const { data } = await supabase.from("drivers").select("*").eq("user_id", user.id).maybeSingle();
    setDriver(data as Driver | null);
    if (data) loadTransports();
    else setLoading(false);
  }

  async function loadTransports() {
    if (!user) return;
    const { data, error } = await supabase
      .from("transports")
      .select("*")
      .eq("driver_id", user.id)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data ?? []) as Transport[]);
    setLoading(false);
  }

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const parsed = driverSchema.safeParse({
      full_name: fd.get("full_name"),
      truck_model: fd.get("truck_model"),
      license_plate: fd.get("license_plate"),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    const { error } = await supabase.from("drivers").insert({ user_id: user.id, ...parsed.data });
    if (error) return toast.error(error.message);
    toast.success("Cadastro concluído!");
    init();
  }

  async function handleVerify() {
    if (!verifyTarget) return;
    if (verifyTarget.status === "em_transporte") {
      // entrega
      if (code.trim().toLowerCase() !== verifyTarget.delivery_code.toLowerCase()) {
        return toast.error("Código de entrega incorreto");
      }
      const { error } = await supabase
        .from("transports")
        .update({ status: "entregue", delivered_at: new Date().toISOString() })
        .eq("id", verifyTarget.id);
      if (error) return toast.error(error.message);
      toast.success("Entrega confirmada!");
    }
    setVerifyTarget(null);
    setCode("");
    loadTransports();
  }

  if (!driver && !loading) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="mb-2 text-2xl font-semibold tracking-tight">Cadastro de motorista</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Para receber entregas, complete seus dados.
        </p>
        <form
          onSubmit={handleRegister}
          className="space-y-4 rounded-xl border border-border bg-surface p-6"
        >
          <div className="space-y-2">
            <Label htmlFor="full_name">Nome completo</Label>
            <Input id="full_name" name="full_name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="truck_model">Modelo do caminhão</Label>
            <Input id="truck_model" name="truck_model" placeholder="Ex.: Volvo FH 540" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="license_plate">Placa</Label>
            <Input id="license_plate" name="license_plate" placeholder="ABC1D23" required />
          </div>
          <Button type="submit" className="w-full">
            Concluir cadastro
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Minhas entregas</h1>
        <p className="text-sm text-muted-foreground">
          {driver && `${driver.truck_model} · ${driver.license_plate}`}
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl border border-border bg-surface" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center">
          <TruckIcon className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-3 font-semibold">Nenhuma entrega atribuída</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Aguarde a transportadora atribuir um pedido a você.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
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
              </div>
              {t.status === "em_transporte" && (
                <Button
                  className="mt-4 w-full"
                  size="sm"
                  onClick={() => setVerifyTarget(t)}
                >
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Validar entrega
                </Button>
              )}
              {t.status === "entregue" && (
                <div className="mt-4 rounded-md bg-status-delivered/10 px-3 py-2 text-center text-xs font-medium text-status-delivered">
                  Carga entregue
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!verifyTarget} onOpenChange={(o) => !o && (setVerifyTarget(null), setCode(""))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validar código de entrega</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Digite o código de entrega informado pelo destinatário para confirmar a entrega.
          </p>
          <div className="space-y-2">
            <Label htmlFor="code">Código de entrega</Label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono uppercase"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button onClick={handleVerify} disabled={!code.trim()}>
              Confirmar entrega
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
