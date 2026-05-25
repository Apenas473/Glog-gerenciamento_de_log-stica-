import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Plus, Trash2, Phone, Truck } from "lucide-react";
import { useStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/motoristas")({
  component: Motoristas,
});

function Motoristas() {
  const { motoristas, addMotorista, removeMotorista } = useStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ nome: "", telefone: "", modelo_caminhao: "", placa: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome || !form.placa) {
      toast.error("Nome e placa são obrigatórios.");
      return;
    }
    addMotorista(form);
    toast.success("Motorista cadastrado.");
    setForm({ nome: "", telefone: "", modelo_caminhao: "", placa: "" });
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
            <h2 className="text-xl font-bold">Motoristas</h2>
            <p className="text-sm text-muted-foreground">{motoristas.length} motorista(s) cadastrado(s)</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4" /> Novo motorista</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Cadastrar Motorista</DialogTitle></DialogHeader>
            <form onSubmit={submit} className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Modelo do caminhão</Label>
                <Input value={form.modelo_caminhao} onChange={(e) => setForm({ ...form, modelo_caminhao: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Placa *</Label>
                <Input value={form.placa} onChange={(e) => setForm({ ...form, placa: e.target.value.toUpperCase() })} />
              </div>
              <DialogFooter>
                <Button type="submit">Cadastrar</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {motoristas.map((m) => (
          <Card key={m.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{m.nome}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {m.telefone || "—"}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1"><Truck className="h-3.5 w-3.5" /> {m.modelo_caminhao || "—"}</p>
                <p className="text-xs font-mono tracking-widest mt-2 inline-block rounded-md bg-muted px-2 py-1">{m.placa}</p>
              </div>
              <button onClick={() => { removeMotorista(m.id); toast.success("Removido."); }} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
