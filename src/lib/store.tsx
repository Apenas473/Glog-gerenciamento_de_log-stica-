import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type UserRole =
  | "cliente"
  | "transportadora"
  | "empresa"
  | "motorista";

export type StatusCarga =
  | "em_espera"
  | "recebida"
  | "entregue";

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

  placa: string;
  capacidade_carga: string;
}

/* =========================
   TRANSPORTE (ATUALIZADO)
========================= */
export interface Transporte {
  id: string;

  empresa: string;

  // coleta
  endereco: string;
  responsavel_coleta?: string;
  telefone_coleta?: string;
  data_coleta?: string;

  // entrega
  local_entrega?: string;
  responsavel_entrega?: string;
  telefone_entrega?: string;
  data_entrega?: string;

  // carga
  carga: string;
  quantidade?: string;
  peso: string;
  volume: string;
  tipo_embalagem?: string;
  informacao_adicional?: string;

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

  addTransporte: (
    t: Omit<
      Transporte,
      | "id"
      | "status"
      | "codigo_seguranca"
      | "motorista_id"
      | "criado_em"
    >
  ) => Transporte;

  atribuirMotorista: (
    transporteId: string,
    motoristaId: string
  ) => void;

  addMotorista: (m: Omit<Motorista, "id">) => Motorista;

  updateMotorista: (id: string, dados: Omit<Motorista, "id">) => void;

  removeMotorista: (id: string) => void;

  validarEntrega: (transporteId: string, codigo: string) => boolean;
}

const StoreCtx = createContext<Store | null>(null);

const genId = () => Math.random().toString(36).slice(2, 10);
const genCodigo = () => Math.random().toString(36).slice(2, 8).toLowerCase();

/* =========================
   DADOS INICIAIS
========================= */

const initialMotoristas: Motorista[] = [
  {
    id: "m1",
    nome: "João Silva",
    telefone: "(11) 98888-1111",
    cpf: "",
    cnh: "",
    categoria_cnh: "",
    marca_caminhao: "Volvo",
    modelo_caminhao: "FH 540",
    tipo_caminhao: "Trator",
    ano_veiculo: "",
    placa: "ABC-1D23",
    capacidade_carga: "",
  },
];

const initialTransportes: Transporte[] = [
  {
    id: "t1",
    empresa: "Supermercados Alfa",
    endereco: "Av. Paulista, 1500 - São Paulo/SP",

    carga: "Alimentos perecíveis",
    peso: "1200kg",
    volume: "8m³",
    observacoes: "Refrigerado",

    status: "em_espera",
    codigo_seguranca: "1wef05",
    motorista_id: null,
    criado_em: new Date().toISOString(),
  },
];

/* =========================
   PROVIDER
========================= */

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
      ...t,
      id: genId(),
      status: "em_espera",
      codigo_seguranca: genCodigo(),
      motorista_id: null,
      criado_em: new Date().toISOString(),
    };

    setTransportes((prev) => [novo, ...prev]);
    return novo;
  };

  const atribuirMotorista = (transporteId: string, motoristaId: string) => {
    setTransportes((prev) =>
      prev.map((t) =>
        t.id === transporteId
          ? { ...t, motorista_id: motoristaId, status: "recebida" }
          : t
      )
    );
  };

  const addMotorista = (m: Omit<Motorista, "id">) => {
    const novo: Motorista = { ...m, id: genId() };
    setMotoristas((prev) => [...prev, novo]);
    return novo;
  };

  const updateMotorista = (id: string, dados: Omit<Motorista, "id">) => {
    setMotoristas((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...dados } : m))
    );
  };

  const removeMotorista = (id: string) => {
    setMotoristas((prev) => prev.filter((m) => m.id !== id));
  };

  const validarEntrega = (transporteId: string, codigo: string) => {
    const transporte = transportes.find((t) => t.id === transporteId);
    if (!transporte) return false;

    if (
      transporte.codigo_seguranca.toLowerCase() ===
      codigo.trim().toLowerCase()
    ) {
      setTransportes((prev) =>
        prev.map((t) =>
          t.id === transporteId ? { ...t, status: "entregue" } : t
        )
      );
      return true;
    }

    return false;
  };

  return (
    <StoreCtx.Provider
      value={{
        role,
        setRole,
        transportes,
        motoristas,
        addTransporte,
        atribuirMotorista,
        addMotorista,
        updateMotorista,
        removeMotorista,
        validarEntrega,
      }}
    >
      {children}
    </StoreCtx.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

/* =========================
   LABELS
========================= */

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