import { StatusCarga, statusLabel } from "@/lib/store";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: StatusCarga;
  className?: string;
}

const styles: Record<StatusCarga, string> = {
  em_espera: "bg-red-100 text-red-700 border border-red-200",
  atribuida: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  recebida: "bg-blue-100 text-blue-700 border border-blue-200",
  entregue: "bg-green-100 text-green-700 border border-green-200",
};

export function StatusBadge({
  status,
  className,
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        styles[status],
        className
      )}
    >
      <span className="h-2 w-2 rounded-full bg-current opacity-80" />

      {statusLabel[status]}
    </span>
  );
}

export default StatusBadge;