import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Boxes, LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login, isLoggedIn, homePath } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  if (isLoggedIn) {
    navigate({ to: homePath });
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const result = login(email, senha);
      if (result.ok && result.path) {
        toast.success("Login realizado com sucesso!");
        navigate({ to: result.path });
      } else {
        toast.error("Usuário ou senha inválidos. Tente novamente.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-accent/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-5 shadow-lg">
            <Boxes className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">G-Log</h1>
          <p className="text-muted-foreground mt-2">Gestão Inteligente de Transporte e Entregas</p>
        </div>

        <div className="rounded-2xl border bg-card shadow-xl p-8">
          <h2 className="text-lg font-semibold mb-1">Bem-vindo de volta</h2>
          <p className="text-sm text-muted-foreground mb-6">Entre com suas credenciais para acessar o sistema</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* <div className="rounded-xl border border-muted/50 bg-muted/5 p-4 text-sm text-muted-foreground">
              Usuários válidos:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li><strong>cliente</strong> / <strong>1234</strong> → Dashboard do cliente</li>
                <li><strong>transportadora</strong> ou <strong>transpor</strong> / <strong>12345</strong> → Transportes</li>
                <li><strong>motorista</strong> / <strong>12345</strong> → Motoristas</li>
                <li><strong>amazon</strong> / <strong>12345</strong> → Solicitar transporte</li>
                <li><strong>cdserra</strong> / <strong>12345</strong> → Validação de entrega</li>
              </ul>
            </div> */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Usuário ou email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="text"
                  placeholder="Seu usuario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="senha" className="text-sm font-medium">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="senha"
                  type={showSenha ? "text" : "password"}
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" defaultChecked />
                <span className="text-muted-foreground">Lembrar-me</span>
              </label>
              {/* <button type="button" className="text-primary hover:underline font-medium">
                Esqueceu a senha?
              </button> */}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Entrar
                </span>
              )}
            </Button>
          </form>

          {/* <div className="mt-6 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <button className="text-primary font-medium hover:underline">Criar conta</button>
            </p>
          </div> */}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Use o nome de usuário indicado acima ou um email válido com senha longa o suficiente para acessar.
        </p>
      </div>
    </div>
  );
}
