import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Boxes, User, Truck, Building2, UserCog, ArrowRight, LogOut } from "lucide-react";
import { useStore, UserRole, roleLabel } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/perfil")({
  component: PerfilPage,
});

const roles: { value: UserRole; icon: any; desc: string }[] = [
  { value: "cliente", icon: User, desc: "Solicite transportes e acompanhe suas cargas" },
  { value: "transportadora", icon: Truck, desc: "Gerencie demandas e atribua motoristas" },
  { value: "empresa", icon: Building2, desc: "Valide entregas com código de segurança" },
  { value: "motorista", icon: UserCog, desc: "Veja suas cargas e rotas atribuídas" },
];

function PerfilPage() {
  const { setRole, logout, isLoggedIn } = useStore();
  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate({ to: "/login" });
    return null;
  }

  const enter = (r: UserRole) => {
    setRole(r);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-accent/30">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4 shadow-lg">
            <Boxes className="h-7 w-7" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">LogiX</h1>
          <p className="text-muted-foreground mt-2">Gestão Inteligente de Transporte e Entregas</p>
          <p className="text-sm text-muted-foreground mt-4">Escolha um perfil para acessar o painel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((r) => (
            <Card
              key={r.value}
              onClick={() => enter(r.value)}
              className="group cursor-pointer p-6 hover:border-primary hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <r.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{roleLabel[r.value]}</h3>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{r.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Sair da conta
          </Button>
        </div>
      </div>
    </div>
  );
}
