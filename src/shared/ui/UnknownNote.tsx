import { Info } from "lucide-react";

interface Props {
  count: number;
  pct: number;
  label: string;
}

export function UnknownNote({ count, pct, label }: Props) {
  return (
    <div className="flex items-center gap-2 mt-3 mb-1">
      <Info size={12} className="text-[var(--text-muted)] shrink-0" />
      <p className="text-xs text-[var(--text-muted)] font-mono">
        <span className="font-semibold">{count.toLocaleString("en-US")}</span> offers ({pct}%) {label}.
      </p>
    </div>
  );
}
