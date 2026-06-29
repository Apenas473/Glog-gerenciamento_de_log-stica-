import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PackagePlus, Copy, CheckCircle2, Plus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const Route = createFileRoute("/solicitar")({
  component: Solicitar,
});

const EMBALAGENS = ["Caixa", "Palete", "Container", "Bag", "Outros"] as const;
const INFO_ADICIONAL = ["Frágil", "Refrigerado", "Inflamável", "Químico", "Alimento"] as const;

interface ItemCarga {
  id: string;
  descricao: string;
  peso: string;
  volume: string;
  embalagem: string;
  infoAdicional: string[];
}

const genId = () => Math.random().toString(36).slice(2, 10);

function Solicitar() {
  const { addTransporte } = useStore();
  const navigate = useNavigate();
  const [created, setCreated] = useState<{ codigo: string; id: string } | null>(null);
  const [form, setForm] = useState({
    empresa: "", endereco: "", observacoes: "",
  });
  const [itens, setItens] = useState<ItemCarga[]>([]);
  const [novoItem, setNovoItem] = useState<{ descricao: string; peso: string; volume: string; embalagem: string; infoAdicional: string[] }>({ descricao: "", peso: "", volume: "", embalagem: "", infoAdicional: [] });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));
  const updateNovoItem = (k: string, v: string | string[]) =>
    setNovoItem((p) => ({ ...p, [k]: v }));

  const toggleInfo = (label: string) =>
    setNovoItem((p) => ({
      ...p,
      infoAdicional: p.infoAdicional.includes(label)
        ? p.infoAdicional.filter((x) => x !== label)
        : [...p.infoAdicional, label],
    }));

  const addItem = () => {
    if (!novoItem.descricao.trim()) {
      toast.error("Informe a descrição do item.");
      return;
    }
    setItens((prev) => [
      ...prev,
      {
        id: genId(),
        descricao: novoItem.descricao.trim(),
        peso: novoItem.peso.trim(),
        volume: novoItem.volume.trim(),
        embalagem: novoItem.embalagem,
        infoAdicional: novoItem.infoAdicional,
      },
    ]);
    setNovoItem({ descricao: "", peso: "", volume: "", embalagem: "", infoAdicional: [] });
  };

  const removeItem = (id: string) => {
    setItens((prev) => prev.filter((i) => i.id !== id));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.empresa || !form.endereco) {
      toast.error("Preencha empresa e endereço.");
      return;
    }
    if (itens.length === 0) {
      toast.error("Adicione pelo menos um item à carga.");
      return;
    }
    const carga = itens.map((i) => i.descricao).join(", ");
    const peso = itens.map((i) => i.peso).filter(Boolean).join(" - ");
    const volume = itens.map((i) => i.volume).filter(Boolean).join(" - ");
    const novo = addTransporte({ ...form, carga, peso, volume });
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
            <Button variant="outline" onClick={() => { setCreated(null); setForm({ empresa: "", endereco: "", observacoes: "" }); setItens([]); }}>
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
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Empresa *</Label>
              <Input id="empresa" value={form.empresa} onChange={(e) => update("empresa", e.target.value)} placeholder="Nome da empresa" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço de coleta *</Label>
              <Input id="endereco" value={form.endereco} onChange={(e) => update("endereco", e.target.value)} placeholder="Rua, número, cidade/UF" />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold">Dados da Carga *</h3>
              <p className="text-xs text-muted-foreground">Adicione um ou mais itens à carga.</p>
            </div>

            <div className="rounded-lg border border-dashed p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="item-desc">Descrição</Label>
                  <Input
                    id="item-desc"
                    value={novoItem.descricao}
                    onChange={(e) => updateNovoItem("descricao", e.target.value)}
                    placeholder="Ex: Alimentos, eletrônicos…"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-peso">Peso</Label>
                  <Input
                    id="item-peso"
                    value={novoItem.peso}
                    onChange={(e) => updateNovoItem("peso", e.target.value)}
                    placeholder="Ex: 1200kg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item-volume">Volume</Label>
                  <Input
                    id="item-volume"
                    value={novoItem.volume}
                    onChange={(e) => updateNovoItem("volume", e.target.value)}
                    placeholder="Ex: 8m³"
                  />
                </div>
              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Tipo de Embalagem</Label>
                  <Select value={novoItem.embalagem} onValueChange={(v) => updateNovoItem("embalagem", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMBALAGENS.map((e) => (
                        <SelectItem key={e} value={e}>{e}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Informação Adicional</Label>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {INFO_ADICIONAL.map((label) => {
                      const checked = novoItem.infoAdicional.includes(label);
                      return (
                        <label key={label} className="flex items-center gap-2 text-sm cursor-pointer">
                          <Checkbox checked={checked} onCheckedChange={() => toggleInfo(label)} />
                          <span>{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={addItem}>
                  <Plus className="h-4 w-4" /> Adicionar item
                </Button>
              </div>
            </div>

            {itens.length > 0 && (
              <ul className="space-y-2">
                {itens.map((it, idx) => (
                  <li
                    key={it.id}
                    className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">
                        {idx + 1}. {it.descricao}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {it.peso || "sem peso"} · {it.volume || "sem volume"}
                        {it.embalagem ? ` · ${it.embalagem}` : ""}
                      </p>
                      {it.infoAdicional.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {it.infoAdicional.map((tag) => (
                            <span key={tag} className="text-[10px] uppercase tracking-wide rounded bg-muted px-1.5 py-0.5 text-muted-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(it.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remover item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="obs">Observações</Label>
            <Textarea id="obs" value={form.observacoes} onChange={(e) => update("observacoes", e.target.value)} placeholder="Refrigerado, frágil, horário…" rows={3} />
          </div>

          <Button type="submit" className="w-full" size="lg">Solicitar Transporte</Button>
        </form>
      </Card>
    </div>
  );
}