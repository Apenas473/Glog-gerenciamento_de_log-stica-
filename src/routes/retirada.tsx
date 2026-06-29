import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, CheckCircle2, MapPin, Package } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";

export const Route = createFileRoute("/retirada")({
  component: Retirada,
});

function Retirada() {
  const { transportes, confirmarRetiradaMotorista } = useStore();
  const atribuidos = transportes.filter((t) => t.status === "atribuida");
  const [transporteId, setTransporteId] = useState("");
  const [codigo, setCodigo] = useState("");
  const [success, setSuccess] = useState(false);

  const transporte = transportes.find((t) => t.id === transporteId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transporteId) return toast.error("Selecione uma carga atribuída.");
    const ok = confirmarRetiradaMotorista(transporteId, codigo);
    if (ok) {
      setSuccess(true);
      toast.success("Retirada confirmada! Carga em trânsito.");
      setTimeout(() => { setSuccess(false); setCodigo(""); setTransporteId(""); }, 2500);
    } else {
      toast.error("Código inválido. Verifique e tente novamente.");
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto">
        <Card className="p-12 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-warning/15 text-warning-foreground mb-4 animate-in zoom-in duration-500">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold">Retirada confirmada!</h2>
          <p className="text-muted-foreground mt-2">O status da carga foi atualizado para Recebida.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Truck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Confirmar Retirada</h2>
          <p className="text-sm text-muted-foreground">Insira o código de segurança fornecido pelo cliente para retirar a carga.</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label>Carga atribuída</Label>
            <Select value={transporteId} onValueChange={setTransporteId}>
              <SelectTrigger><SelectValue placeholder="Escolha a carga a retirar" /></SelectTrigger>
              <SelectContent>
                {atribuidos.length === 0 && (
                  <div className="px-2 py-4 text-sm text-muted-foreground text-center">Nenhuma carga atribuída.</div>
                )}
                {atribuidos.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.empresa} · {t.carga}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {transporte && (
            <div className="rounded-xl border bg-muted/30 p-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{transporte.empresa}</span>
                <StatusBadge status={transporte.status} />
              </div>
              <p className="text-muted-foreground flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" />{transporte.endereco}</p>
              <p className="text-muted-foreground flex items-start gap-2"><Package className="h-4 w-4 mt-0.5" />{transporte.carga}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Código de segurança</Label>
            <Input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: 1wef05"
              className="font-mono tracking-[0.3em] text-center text-lg uppercase"
              maxLength={8}
            />
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={!codigo || !transporteId}>
            Confirmar Retirada
          </Button>
        </form>
      </Card>
    </div>
  );
}
