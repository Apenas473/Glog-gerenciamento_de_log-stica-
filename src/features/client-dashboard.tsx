import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Building2, MapPin, Package } from "lucide-react";
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
  created_at: string;
}

const schema = z.object({
  company: z.string().trim().min(1, "Informe a empresa").max(120),
  address: z.string().trim().min(3, "Endereço muito curto").max(255),
  cargo: z.string().trim().min(1, "Descreva a carga").max(500),
});

export function ClientDashboard() {
  const { user } = useAuth();
  const [items, setItems] = useState<Transport[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    load();
    const ch = supabase
      .channel("client-transports")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transports", filter: `client_id=eq.${user.id}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [user]);

  async function load() {
    const { data, error } = await supabase
      .from("transports")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setItems((data ?? []) as Transport[]);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      company: fd.get("company"),
      address: fd.get("address"),
      cargo: fd.get("cargo"),
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setBusy(true);
    const { error } = await supabase.from("transports").insert({
      client_id: user.id,
      ...parsed.data,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Solicitação criada!");
    setOpen(false);
    load();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Meus transportes</h1>
          <p className="text-sm text-muted-foreground">
            Acompanhe o status de cada solicitação em tempo real.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova solicitação
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova solicitação de transporte</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input id="company" name="company" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço de coleta</Label>
                <Input id="address" name="address" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Descrição da carga</Label>
                <Textarea id="cargo" name="cargo" rows={3} required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={busy}>
                  {busy ? "Criando…" : "Solicitar transporte"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <SkeletonGrid />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <TransportCard key={t.id} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function TransportCard({ t }: { t: Transport }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
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
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center">
      <Package className="mx-auto h-10 w-10 text-muted-foreground" />
      <h3 className="mt-3 font-semibold">Nenhuma solicitação ainda</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Crie sua primeira solicitação de transporte.
      </p>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-48 animate-pulse rounded-xl border border-border bg-surface" />
      ))}
    </div>
  );
}
