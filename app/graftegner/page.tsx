import type { Metadata } from "next";
import { ChartSpline } from "lucide-react";
import { GraphTool } from "@/components/tools/graph-tool";

export const metadata: Metadata = { title: "Graftegner" };

export default function GraphPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6">
      <div className="mt-8 flex items-center gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <ChartSpline className="size-6" />
        </span>
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">Graftegner</h1>
          <p className="text-muted-foreground">Tegn grafer, finn skjæringspunkter og nullpunkter, løs likninger grafisk og lag regresjonsmodeller fra punkter.</p>
        </div>
      </div>
      <div className="mt-8">
        <GraphTool />
      </div>
    </div>
  );
}
