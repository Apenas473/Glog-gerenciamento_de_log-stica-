import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { Motorista } from "@/lib/store";

import {
  Users,
  Plus,
  Trash2,
  Phone,
  Truck,
  CreditCard,
  Pencil,
  BadgeCheck,
} from "lucide-react";

import { useStore } from "@/lib/store";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { toast } from "sonner";

export const Route = createFileRoute("/motoristas")({
  component: Motoristas,
});

const emptyForm = {
  nome: "",
  telefone: "",
  cpf: "",
  cnh: "",
  categoria_cnh: "",
  marca_caminhao: "",
  modelo_caminhao: "",
  tipo_caminhao: "",
  ano_veiculo: "",
  capacidade_carga: "",
  placa: "",
};

function Motoristas() {
  const {
    motoristas,
    addMotorista,
    updateMotorista,
    removeMotorista,
  } = useStore();

  const [open, setOpen] = useState(false);

  const [editando, setEditando] =
    useState<Motorista | null>(null);

  const [form, setForm] =
    useState(emptyForm);

  const submit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      !form.nome ||
      !form.cpf ||
      !form.cnh ||
      !form.categoria_cnh ||
      !form.marca_caminhao ||
      !form.modelo_caminhao ||
      !form.tipo_caminhao ||
      !form.placa
    ) {
      toast.error(
        "Preencha todos os campos obrigatórios."
      );
      return;
    }

    addMotorista({
      nome: form.nome,
      telefone: form.telefone,
      cpf: form.cpf,
      cnh: form.cnh,
      categoria_cnh:
        form.categoria_cnh,
      marca_caminhao:
        form.marca_caminhao,
      modelo_caminhao:
        form.modelo_caminhao,
      tipo_caminhao:
        form.tipo_caminhao,
      ano_veiculo:
        form.ano_veiculo,
      capacidade_carga:
        form.capacidade_carga,
      placa:
        form.placa.toUpperCase(),
    });

    toast.success(
      "Motorista cadastrado com sucesso."
    );

    setForm(emptyForm);
    setOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Motoristas e Veículos
            </h2>

            <p className="text-sm text-muted-foreground">
              {motoristas.length} motorista(s)
              cadastrado(s)
            </p>
          </div>
        </div>

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Motorista
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Cadastro de Motorista
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={submit}
              className="space-y-4"
            >
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>
                    Nome *
                  </Label>

                  <Input
                    value={form.nome}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        nome:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>
                    Telefone
                  </Label>

                  <Input
                    value={
                      form.telefone
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        telefone:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>
                    CPF *
                  </Label>

                  <Input
                    value={form.cpf}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cpf:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>
                    CNH *
                  </Label>

                  <Input
                    value={form.cnh}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cnh:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>
                    Categoria *
                  </Label>

                  <Input
                    value={
                      form.categoria_cnh
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        categoria_cnh:
                          e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                <div>
                  <Label>
                    Placa *
                  </Label>

                  <Input
                    value={form.placa}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        placa:
                          e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                <div>
                  <Label>
                    Marca *
                  </Label>

                  <Input
                    value={
                      form.marca_caminhao
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        marca_caminhao:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>
                    Modelo *
                  </Label>

                  <Input
                    value={
                      form.modelo_caminhao
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        modelo_caminhao:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>
                    Tipo *
                  </Label>

                  <Input
                    value={
                      form.tipo_caminhao
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tipo_caminhao:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <Label>
                    Ano
                  </Label>

                  <Input
                    type="number"
                    value={
                      form.ano_veiculo
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        ano_veiculo:
                          e.target.value,
                      })
                    }
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>
                    Capacidade de Carga
                  </Label>

                  <Input
                    value={
                      form.capacidade_carga
                    }
                    onChange={(e) =>
                      setForm({
                        ...form,
                        capacidade_carga:
                          e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">
                  Cadastrar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {motoristas.map((m) => (
          <Card
            key={m.id}
            className="p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-lg">
                  {m.nome}
                </h3>

                <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                  CNH {m.categoria_cnh}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {m.telefone || "-"}
                </p>

                <p className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  CPF: {m.cpf}
                </p>

                <p>
                  CNH: {m.cnh}
                </p>

                <p className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  {m.marca_caminhao}{" "}
                  {m.modelo_caminhao}
                </p>

                <p>
                  Tipo:{" "}
                  {m.tipo_caminhao}
                </p>

                <p>
                  Ano:{" "}
                  {m.ano_veiculo ||
                    "-"}
                </p>

                <p>
                  Capacidade:{" "}
                  {m.capacidade_carga ||
                    "-"}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <BadgeCheck className="h-4 w-4 text-green-600" />

                  <span className="font-mono">
                    {m.placa}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  setEditando(m)
                }
              >
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  const confirmar =
                    window.confirm(
                      `Excluir ${m.nome}?`
                    );

                  if (!confirmar)
                    return;

                  removeMotorista(
                    m.id
                  );

                  toast.success(
                    "Motorista removido."
                  );
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog
        open={!!editando}
        onOpenChange={() =>
          setEditando(null)
        }
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Editar Motorista
            </DialogTitle>
          </DialogHeader>

          {editando && (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();

                updateMotorista(
                  editando.id,
                  {
                    nome:
                      editando.nome,
                    telefone:
                      editando.telefone,
                    cpf:
                      editando.cpf,
                    cnh:
                      editando.cnh,
                    categoria_cnh:
                      editando.categoria_cnh,
                    marca_caminhao:
                      editando.marca_caminhao,
                    modelo_caminhao:
                      editando.modelo_caminhao,
                    tipo_caminhao:
                      editando.tipo_caminhao,
                    ano_veiculo:
                      editando.ano_veiculo,
                    capacidade_carga:
                      editando.capacidade_carga,
                    placa:
                      editando.placa,
                  }
                );

                toast.success(
                  "Motorista atualizado."
                );

                setEditando(null);
              }}
            >
              <Input
                placeholder="Nome"
                value={
                  editando.nome
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    nome:
                      e.target.value,
                  })
                }
              />

              <Input
                placeholder="Telefone"
                value={
                  editando.telefone
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    telefone:
                      e.target.value,
                  })
                }
              />

              <Input
                placeholder="CPF"
                value={
                  editando.cpf
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    cpf:
                      e.target.value,
                  })
                }
              />

              <Input
                placeholder="CNH"
                value={
                  editando.cnh
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    cnh:
                      e.target.value,
                  })
                }
              />

              <Input
                placeholder="Categoria"
                value={
                  editando.categoria_cnh
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    categoria_cnh:
                      e.target.value.toUpperCase(),
                  })
                }
              />

              <Input
                placeholder="Placa"
                value={
                  editando.placa
                }
                onChange={(e) =>
                  setEditando({
                    ...editando,
                    placa:
                      e.target.value.toUpperCase(),
                  })
                }
              />

              <Button
                type="submit"
                className="w-full"
              >
                Salvar Alterações
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Motoristas;