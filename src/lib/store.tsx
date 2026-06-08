import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type UserRole = "cliente" | "transportadora" | "empresa" | "motorista";
export type StatusCarga = "em_espera" | "recebida" | "entregue";

// Atualizado para incluir todos os campos que seu formulário utiliza
export interface Motorista {
  id: string;
  nome: string;
  telefone: string;
  cpf: string;
  cnh: string;
  categoria_cnh: string;
  marca_caminhao: string;
  modelo_caminhao: string;
  tipo_caminhao: string;
  ano_veiculo: string;
  capacidade_carga: string;
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
  isLoggedIn: boolean;
  homePath: string;
  login: (email: string, senha: string) => { ok: boolean; path?: string };
  logout: () => void;
  transportes: Transporte[];
  motoristas: Motorista[];
  addTransporte: (t: Omit<Transporte, "id" | "status" | "codigo_seguranca" | "motorista_id" | "criado_em">) => Transporte;
  atribuirMotorista: (transporteId: string, motoristaId: string) => void;
  addMotorista: (m: Omit<Motorista, "id">) => Motorista;
  updateMotorista: (id: string, m: Omit<Motorista, "id">) => void; // <-- ADICIONADO NA INTERFACE
  removeMotorista: (id: string) => void;
  validarEntrega: (transporteId: string, codigo: string) => boolean;
}

const StoreCtx = createContext<Store | null>(null);

const genId = () => Math.random().toString(36).slice(2, 10);
const genCodigo = () => Math.random().toString(36).slice(2, 8).toLowerCase();

const loginAccounts: Record<string, { role: UserRole; path: string; password: string }> = {
  cliente: { role: "cliente", path: "/dashboard", password: "1234" },
  transportadora: { role: "transportadora", path: "/transportes", password: "1234" },
  transporte: { role: "transportadora", path: "/transportes", password: "1234" },
  motorista: { role: "motorista", path: "/motoristas", password: "1234" },
  amazon: { role: "cliente", path: "/dashboard", password: "1234" },
  cdserra: { role: "empresa", path: "/validacao", password: "1234" },
};

const getDefaultPathForRole = (role: UserRole) => {
  switch (role) {
    case "cliente":
      return "/dashboard";
    case "transportadora":
      return "/transportes";
    case "motorista":
      return "/motoristas";
    case "empresa":
      return "/dashboard";
  }
};

// Inicializadores atualizados com os novos campos padrão para evitar erros de renderização
const initialMotoristas: Motorista[] = [
  { 
    id: "m1", nome: "João Silva", telefone: "(11) 98888-1111", cpf: "111.111.111-11", 
    cnh: "123456789", categoria_cnh: "E", marca_caminhao: "Volvo", 
    modelo_caminhao: "FH 540", tipo_caminhao: "Carreta", ano_veiculo: "2021", 
    capacidade_carga: "40T", placa: "ABC-1D23" 
  },
  { 
    id: "m2", nome: "Carlos Souza", telefone: "(11) 97777-2222", cpf: "222.222.222-22", 
    cnh: "987654321", categoria_cnh: "D", marca_caminhao: "Scania", 
    modelo_caminhao: "R450", tipo_caminhao: "Truck", ano_veiculo: "2019", 
    capacidade_carga: "23T", placa: "XYZ-2E45" 
  },
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
];

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("cliente");
  const [homePath, setHomePath] = useState<string>(getDefaultPathForRole("cliente"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [transportes, setTransportes] = useState<Transporte[]>(initialTransportes);
  const [motoristas, setMotoristas] = useState<Motorista[]>(initialMotoristas);

  useEffect(() => {
    const savedRole = localStorage.getItem("logix:role");
    const savedAuth = localStorage.getItem("logix:auth");
    const savedHomePath = localStorage.getItem("logix:homePath");
    if (savedRole) setRoleState(savedRole as UserRole);
    if (savedAuth === "1") setIsLoggedIn(true);
    if (savedHomePath) setHomePath(savedHomePath);
  }, []);

  const setRole = (r: UserRole) => {
    setRoleState(r);
    localStorage.setItem("logix:role", r);
    const defaultPath = getDefaultPathForRole(r);
    setHomePath(defaultPath);
    localStorage.setItem("logix:homePath", defaultPath);
  };

  const login = (email: string, senha: string) => {
    const normalized = email.trim().toLowerCase();
    const key = normalized.split("@")[0];
    const account = loginAccounts[normalized] ?? loginAccounts[key];

    if (account && senha === account.password) {
      setIsLoggedIn(true);
      setRoleState(account.role);
      setHomePath(account.path);
      localStorage.setItem("logix:auth", "1");
      localStorage.setItem("logix:role", account.role);
      localStorage.setItem("logix:homePath", account.path);
      return { ok: true, path: account.path };
    }

    if (normalized.includes("@") && senha.length >= 4) {
      const defaultPath = getDefaultPathForRole("cliente");
      setIsLoggedIn(true);
      setRoleState("cliente");
      setHomePath(defaultPath);
      localStorage.setItem("logix:auth", "1");
      localStorage.setItem("logix:role", "cliente");
      localStorage.setItem("logix:homePath", defaultPath);
      return { ok: true, path: defaultPath };
    }

    return { ok: false };
  };

  const logout = () => {
    setIsLoggedIn(false);
    setRoleState("cliente");
    setHomePath(getDefaultPathForRole("cliente"));
    localStorage.removeItem("logix:auth");
    localStorage.removeItem("logix:role");
    localStorage.removeItem("logix:homePath");
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

  // ADICIONADA A IMPLEMENTAÇÃO DO UPDATEMOTORISTA
  const updateMotorista: Store["updateMotorista"] = (id, dadosAtualizados) => {
    setMotoristas((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...dadosAtualizados } : m))
    );
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
    <StoreCtx.Provider value={{ role, setRole, isLoggedIn, homePath, login, logout, transportes, motoristas, addTransporte, atribuirMotorista, addMotorista, updateMotorista, removeMotorista, validarEntrega }}>
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