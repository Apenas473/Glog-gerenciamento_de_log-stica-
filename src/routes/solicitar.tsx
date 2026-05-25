import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PackagePlus, Copy, CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/solicitar")({
  component: Solicitar,
});

function Solicitar() {
  const { addTransporte } = useStore();
  const navigate = useNavigate();
  const [created, setCreated] = useState<{ codigo: string; id: string } | null>(null);
  const [form, setForm] = useState({
    empresa: "", endereco: "", carga: "", peso: "", volume: "", observacoes: "",
  });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.empresa || !form.endereco || !form.carga) {
      toast.error("Preencha empresa, endereço e tipo de carga.");
      return;
    }
    const novo = addTransporte(form);
    setCreated({ codigo: novo.codigo_seguranca, id: novo.id });
    toast.success("Solicitação criada! Código de segurança gerado.");
  };

  const copyCode = () => {
    if (!created) return;
    navigator.clipboard.writeText(created.codigo);
    toast.success("Código copiado");
  };

  if (created) {
    return (
      <div className="max-w-xl mx-auto">
        <Card className="p-8 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15 text-success mb-4">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold">Transporte solicitado com sucesso</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Compartilhe este código com a empresa recebedora para validar a entrega.
          </p>

          <div className="my-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Código de Segurança</p>
            <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-6 py-4">
              <span className="text-3xl font-mono font-bold tracking-[0.3em] text-primary">{created.codigo}</span>
              <button onClick={copyCode} className="text-muted-foreground hover:text-primary">
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => { setCreated(null); setForm({ empresa: "", endereco: "", carga: "", peso: "", volume: "", observacoes: "" }); }}>
              Nova solicitação
            </Button>
            <Button onClick={() => navigate({ to: "/transportes" })}>Ver transportes</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <PackagePlus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Solicitar Transporte</h2>
          <p className="text-sm text-muted-foreground">Preencha os dados da carga para gerar o código de segurança.</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa *</Label>
              <Input id="empresa" value={form.empresa} onChange={(e) => update("empresa", e.target.value)} placeholder="Nome da empresa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço de coleta *</Label>
              <Input id="endereco" value={form.endereco} onChange={(e) => update("endereco", e.target.value)} placeholder="Rua, número, cidade/UF" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="carga">Tipo de carga *</Label>
              <Input id="carga" value={form.carga} onChange={(e) => update("carga", e.target.value)} placeholder="Ex: Alimentos, eletrônicos…" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peso">Peso</Label>
              <Input id="peso" value={form.peso} onChange={(e) => update("peso", e.target.value)} placeholder="Ex: 1200kg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="volume">Volume</Label>
              <Input id="volume" value={form.volume} onChange={(e) => update("volume", e.target.value)} placeholder="Ex: 8m³" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="obs">Observações</Label>
              <Textarea id="obs" value={form.observacoes} onChange={(e) => update("observacoes", e.target.value)} placeholder="Refrigerado, frágil, horário…" rows={3} />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg">Solicitar Transporte</Button>
        </form>
      </Card>
    </div>
  );
}
