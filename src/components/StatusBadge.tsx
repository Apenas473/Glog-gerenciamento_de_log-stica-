import { STATUS_BADGE, STATUS_LABEL, TransportStatus } from "@/lib/status";
import { cn } from "@/lib/utils";

export function StatusBadge({ status, className }: { status: TransportStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STATUS_BADGE[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
