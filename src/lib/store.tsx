import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserRole = "cliente" | "transportadora" | "empresa" | "motorista";
export type StatusCarga = "em_espera" | "recebida" | "entregue";

export interface Motorista {
  id: string;
  nome: string;
  telefone: string;
  modelo_caminhao: string;
  placa: string;
}

export interface Transporte {
  id: string;
  empresa: string;
  endereco: string;
  carga: string;
  peso: string;
  volume: string;
  observacoes: string;
  status: StatusCarga;
  codigo_seguranca: string;
  motorista_id: string | null;
  criado_em: string;
}

interface Store {
  role: UserRole;
  setRole: (r: UserRole) => void;
  transportes: Transporte[];
  motoristas: Motorista[];
  addTransporte: (t: Omit<Transporte, "id" | "status" | "codigo_seguranca" | "motorista_id" | "criado_em">) => Transporte;
  atribuirMotorista: (transporteId: string, motoristaId: string) => void;
  addMotorista: (m: Omit<Motorista, "id">) => Motorista;
  removeMotorista: (id: string) => void;
  validarEntrega: (transporteId: string, codigo: string) => boolean;
}

const StoreCtx = createContext<Store | null>(null);

const genId = () => Math.random().toString(36).slice(2, 10);
const genCodigo = () => Math.random().toString(36).slice(2, 8).toLowerCase();

const initialMotoristas: Motorista[] = [
  { id: "m1", nome: "João Silva", telefone: "(11) 98888-1111", modelo_caminhao: "Volvo FH 540", placa: "ABC-1D23" },
  { id: "m2", nome: "Carlos Souza", telefone: "(11) 97777-2222", modelo_caminhao: "Scania R450", placa: "XYZ-2E45" },
  { id: "m3", nome: "Roberto Lima", telefone: "(11) 96666-3333", modelo_caminhao: "Mercedes Actros", placa: "DEF-3G67" },
];

const initialTransportes: Transporte[] = [
  {
    id: "t1", empresa: "Supermercados Alfa", endereco: "Av. Paulista, 1500 - São Paulo/SP",
    carga: "Alimentos perecíveis", peso: "1200kg", volume: "8m³", observacoes: "Refrigerado",
    status: "em_espera", codigo_seguranca: "1wef05", motorista_id: null,
    criado_em: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "t2", empresa: "Construtora Beta", endereco: "Rua das Obras, 220 - Campinas/SP",
    carga: "Material de construção", peso: "3500kg", volume: "12m³", observacoes: "",
    status: "recebida", codigo_seguranca: "9ab2x4", motorista_id: "m1",
    criado_em: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "t3", empresa: "Farmácia Gama", endereco: "Rua Saúde, 88 - Santos/SP",
    carga: "Medicamentos", peso: "300kg", volume: "2m³", observacoes: "Frágil",
    status: "entregue", codigo_seguranca: "40d53e", motorista_id: "m2",
    criado_em: new Date(Date.now() - 259200000).toISOString(),
  },
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("cliente");
  const [transportes, setTransportes] = useState<Transporte[]>(initialTransportes);
  const [motoristas, setMotoristas] = useState<Motorista[]>(initialMotoristas);

  useEffect(() => {
    const saved = localStorage.getItem("logix:role");
    if (saved) setRoleState(saved as UserRole);
  }, []);

  const setRole = (r: UserRole) => {
    setRoleState(r);
    localStorage.setItem("logix:role", r);
  };

  const addTransporte: Store["addTransporte"] = (t) => {
    const novo: Transporte = {
      ...t, id: genId(), status: "em_espera",
      codigo_seguranca: genCodigo(), motorista_id: null,
      criado_em: new Date().toISOString(),
    };
    setTransportes((prev) => [novo, ...prev]);
    return novo;
  };

  const atribuirMotorista: Store["atribuirMotorista"] = (transporteId, motoristaId) => {
    setTransportes((prev) =>
      prev.map((t) => t.id === transporteId ? { ...t, motorista_id: motoristaId, status: "recebida" } : t)
    );
  };

  const addMotorista: Store["addMotorista"] = (m) => {
    const novo = { ...m, id: genId() };
    setMotoristas((prev) => [...prev, novo]);
    return novo;
  };

  const removeMotorista: Store["removeMotorista"] = (id) => {
    setMotoristas((prev) => prev.filter((m) => m.id !== id));
  };

  const validarEntrega: Store["validarEntrega"] = (transporteId, codigo) => {
    const t = transportes.find((x) => x.id === transporteId);
    if (!t) return false;
    if (t.codigo_seguranca.toLowerCase() === codigo.trim().toLowerCase()) {
      setTransportes((prev) =>
        prev.map((x) => x.id === transporteId ? { ...x, status: "entregue" } : x)
      );
      return true;
    }
    return false;
  };

  return (
    <StoreCtx.Provider value={{ role, setRole, transportes, motoristas, addTransporte, atribuirMotorista, addMotorista, removeMotorista, validarEntrega }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export const statusLabel: Record<StatusCarga, string> = {
  em_espera: "Em Espera",
  recebida: "Recebida",
  entregue: "Entregue",
};

export const roleLabel: Record<UserRole, string> = {
  cliente: "Cliente",
  transportadora: "Transportadora",
  empresa: "Empresa Recebedora",
  motorista: "Motorista",
};
