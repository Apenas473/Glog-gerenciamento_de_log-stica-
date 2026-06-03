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

/* =========================
   FORM PADRÃO
========================= */
const initialForm = {
  empresa: "",
  responsavel_coleta: "",
  telefone_coleta: "",
  endereco: "",
  data_coleta: "",

  local_entrega: "",
  responsavel_entrega: "",
  telefone_entrega: "",
  data_entrega: "",

  carga: "",
  quantidade: "",
  peso: "",
  volume: "",

  tipo_embalagem: "",
  informacao_adicional: "",

  observacoes: "",
};

function Solicitar() {
  const { addTransporte } = useStore();
  const navigate = useNavigate();

  const [created, setCreated] = useState<{ codigo: string; id: string } | null>(null);
  const [form, setForm] = useState(initialForm);

  const update = (k: string, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.empresa || !form.endereco || !form.carga) {
      toast.error("Preencha empresa, endereço e tipo de carga.");
      return;
    }

    const novo = addTransporte(form);

    setCreated({
      codigo: novo.codigo_seguranca,
      id: novo.id,
    });

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

          <h2 className="text-xl font-bold">
            Transporte solicitado com sucesso
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Compartilhe este código com a empresa recebedora para validar a entrega.
          </p>

          <div className="my-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
              Código de Segurança
            </p>

            <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-6 py-4">
              <span className="text-3xl font-mono font-bold tracking-[0.3em] text-primary">
                {created.codigo}
              </span>

              <button
                onClick={copyCode}
                className="text-muted-foreground hover:text-primary"
              >
                <Copy className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setCreated(null);
                setForm(initialForm);
              }}
            >
              Nova solicitação
            </Button>

            <Button onClick={() => navigate({ to: "/transportes" })}>
              Ver transportes
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <PackagePlus className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-xl font-bold">Solicitar Transporte</h2>
          <p className="text-sm text-muted-foreground">
            Preencha os dados da carga para gerar o código de segurança.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={submit} className="space-y-4">

          {/* EMPRESA + ENDEREÇO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Empresa *</Label>
              <Input
                value={form.empresa}
                onChange={(e) => update("empresa", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Endereço *</Label>
              <Input
                value={form.endereco}
                onChange={(e) => update("endereco", e.target.value)}
              />
            </div>
          </div>

          {/* COLETA */}
          <h3 className="font-semibold border-b pb-1">Dados da Coleta</h3>

          <Input
            placeholder="Responsável"
            value={form.responsavel_coleta}
            onChange={(e) => update("responsavel_coleta", e.target.value)}
          />

          <Input
            placeholder="Telefone"
            value={form.telefone_coleta}
            onChange={(e) => update("telefone_coleta", e.target.value)}
          />

          <Input
            type="date"
            value={form.data_coleta}
            onChange={(e) => update("data_coleta", e.target.value)}
          />

          {/* ENTREGA */}
          <h3 className="font-semibold border-b pb-1">Dados da Entrega</h3>

          <Input
            placeholder="Local entrega"
            value={form.local_entrega}
            onChange={(e) => update("local_entrega", e.target.value)}
          />

          <Input
            placeholder="Responsável entrega"
            value={form.responsavel_entrega}
            onChange={(e) => update("responsavel_entrega", e.target.value)}
          />

          <Input
            placeholder="Telefone entrega"
            value={form.telefone_entrega}
            onChange={(e) => update("telefone_entrega", e.target.value)}
          />

          <Input
            type="date"
            value={form.data_entrega}
            onChange={(e) => update("data_entrega", e.target.value)}
          />

          {/* CARGA */}
          <h3 className="font-semibold border-b pb-1">Dados da Carga</h3>

          <Input
            placeholder="Tipo de carga *"
            value={form.carga}
            onChange={(e) => update("carga", e.target.value)}
          />

          <div className="grid grid-cols-3 gap-3">
            <Input
              placeholder="Quantidade"
              value={form.quantidade}
              onChange={(e) => update("quantidade", e.target.value)}
            />

            <Input
              placeholder="Peso"
              value={form.peso}
              onChange={(e) => update("peso", e.target.value)}
            />

            <Input
              placeholder="Volume"
              value={form.volume}
              onChange={(e) => update("volume", e.target.value)}
            />
          </div>

          {/* SELECTS */}
          <select
            className="w-full border rounded-md h-10 px-3"
            value={form.tipo_embalagem}
            onChange={(e) => update("tipo_embalagem", e.target.value)}
          >
            <option value="">Tipo de embalagem</option>
            <option>Bag</option>
            <option>Caixa</option>
            <option>Container</option>
            <option>Metro Cubico</option>
            <option>Palete</option>
            <option>Outros</option>
          </select>

          <select
            className="w-full border rounded-md h-10 px-3"
            value={form.informacao_adicional}
            onChange={(e) =>
              update("informacao_adicional", e.target.value)
            }
          >
            <option value="">Informações adicionais</option>
            <option>Alimento</option>
            <option>Frágil</option>
            <option>Refrigerado</option>
            <option>Inflamável</option>
            <option>Químico</option>
            <option>Outros</option>
          </select>

          {/* OBS */}
          <Textarea
            placeholder="Observações"
            value={form.observacoes}
            onChange={(e) => update("observacoes", e.target.value)}
          />

          {/* BOTÃO */}
          <Button type="submit" className="w-full h-12 text-lg">
            Gerar Solicitação
          </Button>
        </form>
      </Card>
    </div>
  );
}