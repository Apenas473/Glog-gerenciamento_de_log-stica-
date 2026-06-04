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
  | "coletada"
  | "em_transito"
  | "proxima_entrega"
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

export interface Transporte {
  id: string;

  empresa: string;

  endereco: string;
  responsavel_coleta?: string;
  telefone_coleta?: string;
  data_coleta?: string;

  local_entrega?: string;
  responsavel_entrega?: string;
  telefone_entrega?: string;
  data_entrega?: string;

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

  atualizarStatus: (
    transporteId: string,
    status: StatusCarga
  ) => void;

  validarEntrega: (
    transporteId: string,
    codigo: string
  ) => boolean;

  addMotorista: (
    motorista: Omit<Motorista, "id">
  ) => Motorista;

  updateMotorista: (
    id: string,
    dados: Omit<Motorista, "id">
  ) => void;

  removeMotorista: (
    id: string
  ) => void;
}

const StoreCtx = createContext<Store | null>(null);

const genId = () =>
  Math.random()
    .toString(36)
    .slice(2, 10);

const genCodigo = () => {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  return Array.from(
    { length: 8 },
    () =>
      chars[
        Math.floor(
          Math.random() *
            chars.length
        )
      ]
  ).join("");
};

const initialMotoristas: Motorista[] = [
  {
    id: "m1",
    nome: "João Silva",
    telefone:
      "(11) 98888-1111",

    cpf: "",
    cnh: "",
    categoria_cnh: "",

    marca_caminhao:
      "Volvo",

    modelo_caminhao:
      "FH 540",

    tipo_caminhao:
      "Trator",

    ano_veiculo: "",

    placa: "ABC-1D23",

    capacidade_carga:
      "30 toneladas",
  },
];

const initialTransportes: Transporte[] = [
  {
    id: "t1",

    empresa:
      "Supermercados Alfa",

    endereco:
      "Av. Paulista, 1500 - São Paulo/SP",

    carga:
      "Alimentos Perecíveis",

    quantidade: "120",

    peso: "1200kg",

    volume: "8m³",

    tipo_embalagem:
      "Palete",

    informacao_adicional:
      "Refrigerado",

    observacoes:
      "Manter refrigerado",

    status:
      "em_espera",

    codigo_seguranca:
      "ABC12345",

    motorista_id: null,

    criado_em:
      new Date().toISOString(),
  },
];

export function StoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [role, setRoleState] =
    useState<UserRole>(
      "cliente"
    );

  const [
    transportes,
    setTransportes,
  ] = useState<
    Transporte[]
  >([]);

  const [
    motoristas,
    setMotoristas,
  ] = useState<
    Motorista[]
  >([]);

  useEffect(() => {
    const savedRole =
      localStorage.getItem(
        "logix:role"
      );

    if (savedRole) {
      setRoleState(
        savedRole as UserRole
      );
    }

    const savedTransportes =
      localStorage.getItem(
        "logix:transportes"
      );

    const savedMotoristas =
      localStorage.getItem(
        "logix:motoristas"
      );

    if (savedTransportes) {
      setTransportes(
        JSON.parse(
          savedTransportes
        )
      );
    } else {
      setTransportes(
        initialTransportes
      );
    }

    if (savedMotoristas) {
      setMotoristas(
        JSON.parse(
          savedMotoristas
        )
      );
    } else {
      setMotoristas(
        initialMotoristas
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "logix:transportes",
      JSON.stringify(
        transportes
      )
    );
  }, [transportes]);

  useEffect(() => {
    localStorage.setItem(
      "logix:motoristas",
      JSON.stringify(
        motoristas
      )
    );
  }, [motoristas]);

  const setRole = (
    r: UserRole
  ) => {
    setRoleState(r);

    localStorage.setItem(
      "logix:role",
      r
    );
  };

  const addTransporte: Store["addTransporte"] =
    (dados) => {
      const novo: Transporte =
        {
          ...dados,

          id: genId(),

          status:
            "em_espera",

          codigo_seguranca:
            genCodigo(),

          motorista_id:
            null,

          criado_em:
            new Date().toISOString(),
        };

      setTransportes(
        (prev) => [
          novo,
          ...prev,
        ]
      );

      return novo;
    };

  const atribuirMotorista =
    (
      transporteId: string,
      motoristaId: string
    ) => {
      setTransportes(
        (prev) =>
          prev.map((t) =>
            t.id ===
            transporteId
              ? {
                  ...t,
                  motorista_id:
                    motoristaId,
                  status:
                    "coletada",
                }
              : t
          )
      );
    };

  const atualizarStatus =
    (
      transporteId: string,
      status: StatusCarga
    ) => {
      setTransportes(
        (prev) =>
          prev.map((t) =>
            t.id ===
            transporteId
              ? {
                  ...t,
                  status,
                }
              : t
          )
      );
    };

  const validarEntrega =
    (
      transporteId: string,
      codigo: string
    ) => {
      const transporte =
        transportes.find(
          (t) =>
            t.id ===
            transporteId
        );

      if (!transporte)
        return false;

      if (
        transporte.codigo_seguranca.toUpperCase() !==
        codigo
          .trim()
          .toUpperCase()
      ) {
        return false;
      }

      setTransportes(
        (prev) =>
          prev.map((t) =>
            t.id ===
            transporteId
              ? {
                  ...t,
                  status:
                    "entregue",
                }
              : t
          )
      );

      return true;
    };

  const addMotorista =
    (
      motorista: Omit<
        Motorista,
        "id"
      >
    ) => {
      const novo = {
        ...motorista,
        id: genId(),
      };

      setMotoristas(
        (prev) => [
          ...prev,
          novo,
        ]
      );

      return novo;
    };

 const updateMotorista: Store["updateMotorista"] = (id, dados) => {
  setMotoristas((prev) =>
    prev.map((m) =>
      m.id === id
        ? {
            ...m,
            ...dados,
          }
        : m
    )
  );
};

 const removeMotorista: Store["removeMotorista"] = (id) => {
  setMotoristas((prev) =>
    prev.filter((m) => m.id !== id)
  );
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

        atualizarStatus,

        validarEntrega,

        addMotorista,

        updateMotorista,

        removeMotorista,
      }}
    >
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore() {
  const ctx =
    useContext(StoreCtx);

  if (!ctx) {
    throw new Error(
      "useStore must be used inside StoreProvider"
    );
  }

  return ctx;
}

export const statusLabel: Record<
  StatusCarga,
  string
> = {
  em_espera:
    "Em Espera",

  coletada:
    "Coletada",

  em_transito:
    "Em Trânsito",

  proxima_entrega:
    "Próxima Entrega",

  entregue:
    "Entregue",
};

export const roleLabel: Record<
  UserRole,
  string
> = {
  cliente:
    "Cliente",

  transportadora:
    "Transportadora",

  empresa:
    "Empresa Recebedora",

  motorista:
    "Motorista",
};