import { ChartColumn, ChartLine, Equal, Percent, TriangleRight } from "lucide-react";
import type { ComponentType } from "react";

type IconProps = { className?: string };

/** Normalfordelingskurve med gjennomsnittet markert – symbolet for sentral- og spredningsmål. */
export function BellCurve({ className = "size-6" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M2 20h20" />
      <path d="M3 19.5c3.2 0 4.2-13.5 9-13.5s5.8 13.5 9 13.5" />
      <path d="M12 6v14" strokeDasharray="2 2.4" />
    </svg>
  );
}

export const CHAPTER_ICONS: Record<string, ComponentType<IconProps>> = {
  Percent,
  Equal,
  ChartLine,
  ChartColumn,
  BellCurve,
  TriangleRight,
};
