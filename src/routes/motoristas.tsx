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

  const [form, setForm] = useState({
    nome: "",
    telefone: "",
    cpf: "",
    cnh: "",
    categoria_cnh: "",
    modelo_caminhao: "",
    marca_caminhao: "",
    tipo_caminhao: "",
    ano_veiculo: "",
    capacidade_carga: "",
    placa: "",
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !form.nome ||
      !form.cpf ||
      !form.cnh ||
      !form.categoria_cnh ||
      !form.modelo_caminhao ||
      !form.marca_caminhao ||
      !form.tipo_caminhao ||
      !form.placa
    ) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    addMotorista({
      nome: form.nome,
      telefone: form.telefone,
      cpf: form.cpf,
      cnh: form.cnh,
      categoria_cnh: form.categoria_cnh,
      modelo_caminhao: form.modelo_caminhao,
      marca_caminhao: form.marca_caminhao,
      tipo_caminhao: form.tipo_caminhao,
      ano_veiculo: form.ano_veiculo,
      capacidade_carga: form.capacidade_carga,
      placa: form.placa,
    });

    toast.success("Motorista cadastrado com sucesso.");

    setForm({
      nome: "",
      telefone: "",
      cpf: "",
      cnh: "",
      categoria_cnh: "",
      modelo_caminhao: "",
      marca_caminhao: "",
      tipo_caminhao: "",
      ano_veiculo: "",
      capacidade_carga: "",
      placa: "",
    });

    setOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Motoristas e Veículos
            </h2>

            <p className="text-sm text-muted-foreground">
              {motoristas.length} motorista(s) cadastrado(s)
            </p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Motorista
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Cadastro de Motorista e Veículo
              </DialogTitle>
            </DialogHeader>

            <form
              onSubmit={submit}
              className="space-y-4 py-2"
            >
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={form.nome}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      nome: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={form.telefone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      telefone: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>CPF *</Label>
                <Input
                  value={form.cpf}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cpf: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>CNH *</Label>
                <Input
                  value={form.cnh}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      cnh: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Categoria CNH *</Label>
                <Input
                  placeholder="C, D ou E"
                  value={form.categoria_cnh}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categoria_cnh:
                        e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Marca do Caminhão *</Label>
                <Input
                  value={form.marca_caminhao}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      marca_caminhao: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Modelo do Caminhão *</Label>
                <Input
                  value={form.modelo_caminhao}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      modelo_caminhao: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo do Caminhão *</Label>
                <Input
                  placeholder="Truck, Carreta, Bitrem..."
                  value={form.tipo_caminhao}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tipo_caminhao: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Ano do Veículo</Label>
                <Input
                  type="number"
                  value={form.ano_veiculo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      ano_veiculo: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Capacidade de Carga (kg)</Label>
                <Input
                  type="number"
                  value={form.capacidade_carga}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      capacidade_carga: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Placa *</Label>
                <Input
                  value={form.placa}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      placa: e.target.value.toUpperCase(),
                    })
                  }
                />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {motoristas.map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">
                  {m.nome}
                </h3>

                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {m.telefone || "-"}
                </p>

                <p className="text-sm">
                  <CreditCard className="h-4 w-4 inline mr-1" />
                  CPF: {m.cpf}
                </p>

                <p className="text-sm">
                  CNH: {m.cnh}
                </p>

                <p className="text-sm">
                  Categoria: {m.categoria_cnh}
                </p>

                <p className="text-sm flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  {m.marca_caminhao}
                </p>

                <p className="text-sm">
                  Modelo: {m.modelo_caminhao}
                </p>

                <p className="text-sm">
                  Tipo: {m.tipo_caminhao}
                </p>

                <p className="text-sm">
                  Ano: {m.ano_veiculo || "-"}
                </p>

                <p className="text-sm">
                  Capacidade: {m.capacidade_carga || "-"} kg
                </p>

                <p className="text-xs font-mono tracking-widest mt-2 inline-block rounded-md bg-muted px-2 py-1">
                  {m.placa}
                </p>
              </div>
            </div>  

              <div className="flex gap-2">
  <button
  onClick={() => setEditando(m)}
  className="p-4 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200"
>
  <Pencil className="h-6 w-6" />
</button>

  <button
  onClick={() => {
    removeMotorista(m.id);
    toast.success("Motorista removido.");
  }}
  className="p-4 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
>
  <Trash2 className="h-6 w-6" />
</button>
</div>

          </Card>
        ))}
      </div>

<Dialog
  open={!!editando}
  onOpenChange={() => setEditando(null)}
>
  <DialogContent className="max-h-[90vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>
        Editar Motorista
      </DialogTitle>
    </DialogHeader>

    {editando && (
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();

          updateMotorista(editando.id, {
            nome: editando.nome,
            telefone: editando.telefone,
            cpf: editando.cpf,
            cnh: editando.cnh,
            categoria_cnh: editando.categoria_cnh,
            marca_caminhao: editando.marca_caminhao,
            modelo_caminhao: editando.modelo_caminhao,
            tipo_caminhao: editando.tipo_caminhao,
            ano_veiculo: editando.ano_veiculo,
            capacidade_carga: editando.capacidade_carga,
            placa: editando.placa,
          });

          toast.success("Motorista atualizado.");
          setEditando(null);
        }}
      >
        <Input
          value={editando.nome}
          onChange={(e) =>
            setEditando({
              ...editando,
              nome: e.target.value,
            })
          }
          placeholder="Nome"
        />

        <Input
          value={editando.telefone}
          onChange={(e) =>
            setEditando({
              ...editando,
              telefone: e.target.value,
            })
          }
          placeholder="Telefone"
        />

        <Input
          value={editando.cpf}
          onChange={(e) =>
            setEditando({
              ...editando,
              cpf: e.target.value,
            })
          }
          placeholder="CPF"
        />

        <Input
          value={editando.cnh}
          onChange={(e) =>
            setEditando({
              ...editando,
              cnh: e.target.value,
            })
          }
          placeholder="CNH"
        />

        <Input
          value={editando.categoria_cnh}
          onChange={(e) =>
            setEditando({
              ...editando,
              categoria_cnh: e.target.value,
            })
          }
          placeholder="Categoria CNH"
        />

        <Input
          value={editando.marca_caminhao}
          onChange={(e) =>
            setEditando({
              ...editando,
              marca_caminhao: e.target.value,
            })
          }
          placeholder="Marca"
        />

        <Input
          value={editando.modelo_caminhao}
          onChange={(e) =>
            setEditando({
              ...editando,
              modelo_caminhao: e.target.value,
            })
          }
          placeholder="Modelo"
        />

        <Input
          value={editando.tipo_caminhao}
          onChange={(e) =>
            setEditando({
              ...editando,
              tipo_caminhao: e.target.value,
            })
          }
          placeholder="Tipo"
        />

        <Input
          value={editando.ano_veiculo}
          onChange={(e) =>
            setEditando({
              ...editando,
              ano_veiculo: e.target.value,
            })
          }
          placeholder="Ano"
        />

        <Input
          value={editando.capacidade_carga}
          onChange={(e) =>
            setEditando({
              ...editando,
              capacidade_carga: e.target.value,
            })
          }
          placeholder="Capacidade"
        />

        <Input
          value={editando.placa}
          onChange={(e) =>
            setEditando({
              ...editando,
              placa: e.target.value.toUpperCase(),
            })
          }
          placeholder="Placa"
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