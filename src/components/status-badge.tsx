import { StatusCarga, statusLabel } from "@/lib/store";
import { cn } from "@/lib/utils";

const styles: Record<StatusCarga, string> = {
  em_espera: "bg-destructive text-destructive-foreground",
  recebida: "bg-warning text-warning-foreground",
  entregue: "bg-success text-success-foreground",
};

export function StatusBadge({ status, className }: { status: StatusCarga; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
      styles[status],
      className,
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      {statusLabel[status]}
    </span>
  );
}
