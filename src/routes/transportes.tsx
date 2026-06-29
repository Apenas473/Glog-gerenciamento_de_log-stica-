import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  Truck,
  MapPin,
  Package,
  KeyRound,
  UserCheck,
  Search,
} from "lucide-react";

import { useStore, Transporte } from "@/lib/store";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";

export const Route = createFileRoute("/transportes")({
  component: Transportes,
});

function Transportes() {
  const {
    transportes,
    motoristas,
    atribuirMotorista,
    atualizarStatus,
    role,
  } = useStore();

  const [selected, setSelected] =
    useState<Transporte | null>(null);

  const [motoristaId, setMotoristaId] =
    useState("");

  const [busca, setBusca] =
    useState("");

  const canAssign =
    role === "transportadora";

  const transportesFiltrados =
    transportes.filter((t) =>
      t.empresa
        .toLowerCase()
        .includes(
          busca.toLowerCase()
        )
    );

  const confirmar = () => {
    if (!selected || !motoristaId)
      return;

    atribuirMotorista(
      selected.id,
      motoristaId
    );

    toast.success(
      "Motorista atribuído com sucesso."
    );

    setSelected(null);
    setMotoristaId("");
  };

  const total =
    transportes.length;

  const pendentes =
    transportes.filter(
      (t) =>
        t.status !==
        "entregue"
    ).length;

  const entregues =
    transportes.filter(
      (t) =>
        t.status ===
        "entregue"
    ).length;

  const emTransito =
    transportes.filter(
      (t) =>
        t.status ===
        "recebida"
    ).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Truck className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Gerenciamento de Transportes
          </h2>

          <p className="text-sm text-muted-foreground">
            Controle completo das cargas
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Total
          </p>

          <p className="text-3xl font-bold">
            {total}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Pendentes
          </p>

          <p className="text-3xl font-bold">
            {pendentes}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Em Trânsito
          </p>

          <p className="text-3xl font-bold">
            {emTransito}
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">
            Entregues
          </p>

          <p className="text-3xl font-bold">
            {entregues}
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            className="pl-9"
            placeholder="Pesquisar empresa..."
            value={busca}
            onChange={(e) =>
              setBusca(
                e.target.value
              )
            }
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {transportesFiltrados.map(
          (t) => {
            const motorista =
              motoristas.find(
                (m) =>
                  m.id ===
                  t.motorista_id
              );

            return (
              <Card
                key={t.id}
                className="p-5 space-y-3"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">
                    {t.empresa}
                  </h3>

                  <StatusBadge
                    status={
                      t.status
                    }
                  />
                </div>

                <div className="space-y-2 text-sm">
                  <p className="flex gap-2">
                    <MapPin className="h-4 w-4" />
                    {t.endereco}
                  </p>

                  {t.local_entrega && (
                    <p>
                      <strong>
                        Entrega:
                      </strong>{" "}
                      {
                        t.local_entrega
                      }
                    </p>
                  )}

                  {t.responsavel_coleta && (
                    <p>
                      <strong>
                        Coleta:
                      </strong>{" "}
                      {
                        t.responsavel_coleta
                      }
                    </p>
                  )}

                  {t.responsavel_entrega && (
                    <p>
                      <strong>
                        Recebimento:
                      </strong>{" "}
                      {
                        t.responsavel_entrega
                      }
                    </p>
                  )}

                  <p className="flex gap-2">
                    <Package className="h-4 w-4" />
                    {t.carga}
                  </p>

                  <p>
                    Peso: {t.peso}
                  </p>

                  <p>
                    Volume:
                    {" "}
                    {t.volume}
                  </p>

                  {t.quantidade && (
                    <p>
                      Quantidade:
                      {" "}
                      {
                        t.quantidade
                      }
                    </p>
                  )}

                  {t.tipo_embalagem && (
                    <p>
                      Embalagem:
                      {" "}
                      {
                        t.tipo_embalagem
                      }
                    </p>
                  )}

                  {t.informacao_adicional && (
                    <p>
                      Informação:
                      {" "}
                      {
                        t.informacao_adicional
                      }
                    </p>
                  )}

                  <p className="flex gap-2">
                    <KeyRound className="h-4 w-4" />

                    <span className="font-mono">
                      {
                        t.codigo_seguranca
                      }
                    </span>
                  </p>

                  {motorista && (
                    <p className="flex gap-2">
                      <UserCheck className="h-4 w-4" />
                      {
                        motorista.nome
                      }
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  {canAssign &&
                    t.status ===
                      "em_espera" && (
                      <Button
                        onClick={() =>
                          setSelected(
                            t
                          )
                        }
                      >
                        Atribuir
                        Motorista
                      </Button>
                    )}

                  {t.status ===
                    "coletada" && (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        atualizarStatus(
                          t.id,
                          "em_transito"
                        )
                      }
                    >
                      Iniciar
                      Viagem
                    </Button>
                  )}

                  {t.status ===
                    "em_transito" && (
                    <Button
                      variant="secondary"
                      onClick={() =>
                        atualizarStatus(
                          t.id,
                          "proxima_entrega"
                        )
                      }
                    >
                      Próxima
                      Entrega
                    </Button>
                  )}
                </div>
              </Card>
            );
          }
        )}
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(o) =>
          !o &&
          setSelected(null)
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Selecionar
              Motorista
            </DialogTitle>

            <DialogDescription>
              Escolha o
              motorista
              responsável
              pela carga.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Label>
              Motorista
            </Label>

            <Select
              value={
                motoristaId
              }
              onValueChange={
                setMotoristaId
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um motorista" />
              </SelectTrigger>

              <SelectContent>
                {motoristas.map(
                  (m) => (
                    <SelectItem
                      key={
                        m.id
                      }
                      value={
                        m.id
                      }
                    >
                      {m.nome} •{" "}
                      {
                        m.placa
                      }
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setSelected(
                  null
                )
              }
            >
              Cancelar
            </Button>

            <Button
              onClick={
                confirmar
              }
              disabled={
                !motoristaId
              }
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Transportes;