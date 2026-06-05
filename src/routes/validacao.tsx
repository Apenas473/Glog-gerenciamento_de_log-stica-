import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import {
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Package,
  KeyRound,
  Building2,
} from "lucide-react";

import { useStore } from "@/lib/store";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StatusBadge } from "@/components/status-badge";

import { toast } from "sonner";

export const Route = createFileRoute("/validacao")({
  component: Validacao,
});

function Validacao() {
  const { transportes, validarEntrega } = useStore();

  const pendentes = transportes.filter(
    (t) => t.status !== "entregue"
  );

  const [transporteId, setTransporteId] =
    useState("");

  const [codigo, setCodigo] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const transporte = transportes.find(
    (t) => t.id === transporteId
  );

  const validar = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!transporteId) {
      toast.error(
        "Selecione um transporte."
      );
      return;
    }

    const ok = validarEntrega(
      transporteId,
      codigo
    );

    if (ok) {
      setSuccess(true);

      toast.success(
        "Entrega validada com sucesso."
      );

      setTimeout(() => {
        setSuccess(false);
        setCodigo("");
        setTransporteId("");
      }, 3000);
    } else {
      toast.error(
        "Código inválido."
      );
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto">
        <Card className="p-12 text-center">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600 mb-6 animate-in zoom-in duration-500">
            <CheckCircle2 className="h-14 w-14" />
          </div>

          <h2 className="text-3xl font-bold">
            Entrega Confirmada
          </h2>

          <p className="text-muted-foreground mt-3">
            O transporte foi marcado
            como entregue com sucesso.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShieldCheck className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-2xl font-bold">
            Validação de Entrega
          </h2>

          <p className="text-sm text-muted-foreground">
            Confirme o recebimento
            através do código de
            segurança.
          </p>
        </div>
      </div>

      <Card className="p-6">
        <form
          onSubmit={validar}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label>
              Transporte
            </Label>

            <Select
              value={transporteId}
              onValueChange={
                setTransporteId
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um transporte" />
              </SelectTrigger>

              <SelectContent>
                {pendentes.map(
                  (t) => (
                    <SelectItem
                      key={t.id}
                      value={t.id}
                    >
                      {t.empresa} •{" "}
                      {t.carga}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {transporte && (
            <Card className="p-4 border-dashed">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  Dados da Carga
                </h3>

                <StatusBadge
                  status={
                    transporte.status
                  }
                />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex gap-2">
                  <Building2 className="h-4 w-4 mt-0.5" />
                  <span>
                    {
                      transporte.empresa
                    }
                  </span>
                </div>

                <div className="flex gap-2">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>
                    {
                      transporte.endereco
                    }
                  </span>
                </div>

                <div className="flex gap-2">
                  <Package className="h-4 w-4 mt-0.5" />
                  <span>
                    {
                      transporte.carga
                    }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Peso
                  </span>

                  <span className="font-medium">
                    {
                      transporte.peso
                    }
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Volume
                  </span>

                  <span className="font-medium">
                    {
                      transporte.volume
                    }
                  </span>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-2">
            <Label>
              Código de Segurança
            </Label>

            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

              <Input
                value={codigo}
                onChange={(e) =>
                  setCodigo(
                    e.target.value.toUpperCase()
                  )
                }
                placeholder="ABC12345"
                maxLength={8}
                className="pl-10 font-mono text-center text-lg tracking-[0.3em]"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={
              !codigo ||
              !transporteId
            }
          >
            Confirmar Entrega
          </Button>
        </form>
      </Card>
    </div>
  );
}