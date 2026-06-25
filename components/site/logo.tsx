import { Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="grid h-8 w-8 place-items-center rounded-xl bg-spectrum shadow-glow-brand">
        <Wand2 className="h-4 w-4 text-white" />
      </span>
      <span className="font-display text-lg font-bold tracking-tight">
        Photo<span className="text-gradient">Touch</span>
      </span>
    </span>
  );
}
