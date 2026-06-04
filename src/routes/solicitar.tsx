import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import {
  PackagePlus,
  Copy,
  CheckCircle2,
  Building2,
  Truck,
  MapPin,
  Package,
} from "lucide-react";

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

const initialForm = {
  empresa: "",
  responsavel_coleta: "",
  telefone_coleta: "",
  endereco: "",
  cep: "",
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

  const [created, setCreated] = useState<{
    codigo: string;
    id: string;
  } | null>(null);

  const [form, setForm] =
    useState(initialForm);

  const update = (
    campo: string,
    valor: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const submit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !form.empresa ||
      !form.endereco ||
      !form.carga
    ) {
      toast.error(
        "Preencha os campos obrigatórios."
      );
      return;
    }

    try {
      const novo =
        addTransporte(form);

      setCreated({
        codigo:
          novo.codigo_seguranca,
        id: novo.id,
      });

      toast.success(
        "Solicitação criada com sucesso."
      );
    } catch {
      toast.error(
        "Erro ao criar transporte."
      );
    }
  };

  const copyCode = () => {
    if (!created) return;

    navigator.clipboard.writeText(
      created.codigo
    );

    toast.success(
      "Código copiado."
    );
  };

  if (created) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-10 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <h2 className="text-2xl font-bold">
            Transporte Criado
          </h2>

          <p className="text-muted-foreground mt-2">
            Compartilhe este código
            com o destinatário para
            validar a entrega.
          </p>

          <div className="my-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Código de Segurança
            </p>

            <div className="inline-flex items-center gap-3 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 px-6 py-4">
              <span className="font-mono text-3xl font-bold tracking-[0.3em] text-primary">
                {created.codigo}
              </span>

              <button
                type="button"
                onClick={copyCode}
              >
                <Copy className="h-5 w-5 text-muted-foreground hover:text-primary" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setCreated(null);
                setForm(
                  initialForm
                );
              }}
            >
              Nova Solicitação
            </Button>

            <Button
              onClick={() =>
                navigate({
                  to: "/transportes",
                })
              }
            >
              Ver Transportes
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <PackagePlus className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Solicitar Transporte
          </h2>

          <p className="text-muted-foreground">
            Cadastre uma nova carga
            para transporte.
          </p>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="space-y-6"
      >
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">
              Empresa
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>
                Empresa *
              </Label>

              <Input
              placeholder="Nome da empresa"
                value={form.empresa}
                onChange={(e) =>
                  update(
                    "empresa",
                    e.target.value
                  )
                }
              />
            </div>

            <div>
              <Label>
                Endereço *
              </Label>

              <Input
              placeholder="Digite o endereço"
                value={form.endereco}
                onChange={(e) =>
                  update(
                    "endereco",
                    e.target.value
                  )
                }
              />
            </div>
            
            <div>
              <Label>
                CEP *
              </Label>

              <Input
              placeholder="Digite o CEP"
                value={form.cep}
                onChange={(e) =>
                  update(
                    "cep",
                    e.target.value
                  )
                }
              />
            </div>

          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Truck className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">
              Dados da Coleta
            </h3>
          </div>

          <Input
            placeholder="Responsável pela coleta"
            value={
              form.responsavel_coleta
            }
            onChange={(e) =>
              update(
                "responsavel_coleta",
                e.target.value
              )
            }
          />

          <Input
            placeholder="Telefone"
            value={
              form.telefone_coleta
            }
            onChange={(e) =>
              update(
                "telefone_coleta",
                e.target.value
              )
            }
          />

          <Input
            type="date"
            value={
              form.data_coleta
            }
            onChange={(e) =>
              update(
                "data_coleta",
                e.target.value
              )
            }
          />
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">
              Dados da Entrega
            </h3>
          </div>

          <Input
            placeholder="Local de entrega"
            value={
              form.local_entrega
            }
            onChange={(e) =>
              update(
                "local_entrega",
                e.target.value
              )
            }
          />

          <Input
            placeholder="Responsável"
            value={
              form.responsavel_entrega
            }
            onChange={(e) =>
              update(
                "responsavel_entrega",
                e.target.value
              )
            }
          />

          <Input
            placeholder="Telefone"
            value={
              form.telefone_entrega
            }
            onChange={(e) =>
              update(
                "telefone_entrega",
                e.target.value
              )
            }
          />

          <Input
            type="date"
            value={
              form.data_entrega
            }
            onChange={(e) =>
              update(
                "data_entrega",
                e.target.value
              )
            }
          />
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 border-b pb-3">
            <Package className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">
              Dados da Carga
            </h3>
          </div>

          <Input
            placeholder="Tipo de carga"
            value={form.carga}
            onChange={(e) =>
              update(
                "carga",
                e.target.value
              )
            }
          />

          <div className="grid md:grid-cols-3 gap-4">
            <Input
              placeholder="Quantidade"
              value={
                form.quantidade
              }
              onChange={(e) =>
                update(
                  "quantidade",
                  e.target.value
                )
              }
            />

            <Input
              placeholder="Peso"
              value={form.peso}
              onChange={(e) =>
                update(
                  "peso",
                  e.target.value
                )
              }
            />

            <Input
              placeholder="Volume"
              value={form.volume}
              onChange={(e) =>
                update(
                  "volume",
                  e.target.value
                )
              }
            />
          </div>

          <select
            className="w-full border rounded-md h-10 px-3"
            value={
              form.tipo_embalagem
            }
            onChange={(e) =>
              update(
                "tipo_embalagem",
                e.target.value
              )
            }
          >
            <option value="">
              Tipo de Embalagem
            </option>
            <option>
              Caixa
            </option>
            <option>
              Palete
            </option>
            <option>
              Container
            </option>
            <option>
              Bag
            </option>
            <option>
              Outros
            </option>
          </select>

          <select
            className="w-full border rounded-md h-10 px-3"
            value={
              form.informacao_adicional
            }
            onChange={(e) =>
              update(
                "informacao_adicional",
                e.target.value
              )
            }
          >
            <option value="">
              Informação Adicional
            </option>
            <option>
              Frágil
            </option>
            <option>
              Refrigerado
            </option>
            <option>
              Inflamável
            </option>
            <option>
              Químico
            </option>
            <option>
              Alimento
            </option>
          </select>

          <Textarea
            placeholder="Observações"
            value={
              form.observacoes
            }
            onChange={(e) =>
              update(
                "observacoes",
                e.target.value
              )
            }
          />
        </Card>

        <Card className="p-4 bg-muted/30">
          <h4 className="font-semibold mb-3">
            Resumo da Solicitação
          </h4>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">
                Empresa
              </span>
              <p>
                {form.empresa ||
                  "-"}
              </p>
            </div>

            <div>
              <span className="text-muted-foreground">
                Carga
              </span>
              <p>
                {form.carga ||
                  "-"}
              </p>
            </div>

            <div>
              <span className="text-muted-foreground">
                Peso
              </span>
              <p>
                {form.peso ||
                  "-"}
              </p>
            </div>

            <div>
              <span className="text-muted-foreground">
                Volume
              </span>
              <p>
                {form.volume ||
                  "-"}
              </p>
            </div>
          </div>
        </Card>

        <Button
          type="submit"
          size="lg"
          className="w-full h-12"
        >
          Gerar Transporte
        </Button>
      </form>
    </div>
  );
}