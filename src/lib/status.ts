export type TransportStatus = "em_espera" | "em_transporte" | "entregue";

export const STATUS_LABEL: Record<TransportStatus, string> = {
  em_espera: "Em espera",
  em_transporte: "Em transporte",
  entregue: "Entregue",
};

export const STATUS_BADGE: Record<TransportStatus, string> = {
  em_espera: "bg-status-waiting text-status-waiting-foreground",
  em_transporte: "bg-status-transit text-status-transit-foreground",
  entregue: "bg-status-delivered text-status-delivered-foreground",
};
