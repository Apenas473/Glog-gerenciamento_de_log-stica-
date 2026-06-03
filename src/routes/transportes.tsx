import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, MapPin, Package, KeyRound, UserCheck } from "lucide-react";
import { useStore, Transporte } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/transportes")({
  component: Transportes,
});

function Transportes() {
  const { transportes, motoristas, atribuirMotorista, role } = useStore();
  const [selected, setSelected] = useState<Transporte | null>(null);
  const [motoristaId, setMotoristaId] = useState("");

  const canAssign = role === "transportadora";

  const confirmar = () => {
    if (!selected || !motoristaId) return;
    atribuirMotorista(selected.id, motoristaId);
    toast.success("Motorista atribuído. Status atualizado para Recebida.");
    setSelected(null);
    setMotoristaId("");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Gerenciamento de Transportes</h2>
            <p className="text-sm text-muted-foreground">{transportes.length} carga(s) registrada(s)</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs">
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" />Em Espera</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" />Recebida</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" />Entregue</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {transportes.map((t) => {
          const motorista = motoristas.find((m) => m.id === t.motorista_id);
          return (
            <Card key={t.id} className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold leading-tight">{t.empresa}</h3>
                <StatusBadge status={t.status} />
              </div>

              <div className="space-y-1.5 text-sm text-muted-foreground">
                <p className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 shrink-0" /><span>{t.endereco}</span></p>
                <p className="flex items-start gap-2"><Package className="h-4 w-4 mt-0.5 shrink-0" /><span>{t.carga} · {t.peso || "-"} · {t.volume || "-"}</span></p>
                <p className="flex items-start gap-2"><KeyRound className="h-4 w-4 mt-0.5 shrink-0" /><span className="font-mono tracking-widest">{t.codigo_seguranca}</span></p>
                {motorista && (
                  <p className="flex items-start gap-2"><UserCheck className="h-4 w-4 mt-0.5 shrink-0" /><span>{motorista.nome} · {motorista.placa}</span></p>
                )}
              </div>

              {canAssign && t.status === "em_espera" && (
                <Button size="sm" className="mt-1" onClick={() => setSelected(t)}>
                  Selecionar Motorista
                </Button>
              )}
            </Card>
          );
        })}
        {transportes.length === 0 && (
          <Card className="p-12 text-center col-span-full">
            <p className="text-muted-foreground">Nenhum transporte cadastrado.</p>
          </Card>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Selecionar Motorista</DialogTitle>
            <DialogDescription>
              Atribua um motorista a esta carga. O status será atualizado para "Recebida".
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label>Motorista</Label>
            <Select value={motoristaId} onValueChange={setMotoristaId}>
              <SelectTrigger><SelectValue placeholder="Escolha um motorista" /></SelectTrigger>
              <SelectContent>
                {motoristas.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.nome} · {m.modelo_caminhao} · {m.placa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelected(null)}>Cancelar</Button>
            <Button onClick={confirmar} disabled={!motoristaId}>Confirmar Transporte</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
