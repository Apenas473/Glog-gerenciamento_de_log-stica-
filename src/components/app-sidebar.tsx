import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, PackagePlus, Truck, Users, ShieldCheck, LogOut, Boxes, UserCircle } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { useStore, UserRole, roleLabel } from "@/lib/store";

interface NavItem { title: string; url: string; icon: any; roles: UserRole[]; }

const items: NavItem[] = [
  { title: "Painel de Acompanhamento", url: "/dashboard", icon: LayoutDashboard, roles: ["cliente", "transportadora", "empresa", "motorista"] },
  { title: "Solicitar Transporte", url: "/solicitar", icon: PackagePlus, roles: ["cliente"] },
  { title: "Transportes", url: "/transportes", icon: Truck, roles: ["cliente", "transportadora", "motorista"] },
  { title: "Motoristas", url: "/motoristas", icon: Users, roles: ["transportadora"] },
   { title: "Confirmar Retirada", url: "/retirada", icon: Truck, roles: ["motorista"] },
  { title: "Validar Entrega", url: "/validacao", icon: ShieldCheck, roles: ["empresa"] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { role, logout } = useStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const visible = items.filter((i) => i.roles.includes(role));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link to="/dashboard" className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Boxes className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">G-Log</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Gestão de Transporte</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visible.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        {!collapsed && (
          <div className="px-2 py-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1.5">Perfil atual</p>
            <p className="text-sm font-semibold">{roleLabel[role]}</p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/perfil">
                <UserCircle className="h-4 w-4" />
                <span>Trocar perfil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => { logout(); navigate({ to: "/login" }); }}
              className="cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
