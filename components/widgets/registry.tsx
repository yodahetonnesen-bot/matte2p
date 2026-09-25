"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";

type P = { props: Record<string, string> };

const Loading = () => <div className="h-72 animate-pulse rounded-2xl border border-border bg-muted/60" />;

// Navnet her er det som skrives i innholdet: ::widget prosent start=400 p=20
const W: Record<string, ComponentType<P>> = {
  prosent: dynamic(() => import("./prosent").then((m) => m.ProsentWidget), { ssr: false, loading: Loading }),
  vekst: dynamic(() => import("./vekst").then((m) => m.VekstWidget), { ssr: false, loading: Loading }),
  proporsjonal: dynamic(() => import("./proporsjonal").then((m) => m.ProporsjonalWidget), { ssr: false, loading: Loading }),
  regresjon: dynamic(() => import("./regresjon").then((m) => m.RegresjonWidget), { ssr: false, loading: Loading }),
  sentralmal: dynamic(() => import("./sentralmal").then((m) => m.SentralmalWidget), { ssr: false, loading: Loading }),
  histogram: dynamic(() => import("./histogram").then((m) => m.HistogramWidget), { ssr: false, loading: Loading }),
  skalvekt: dynamic(() => import("./skalvekt").then((m) => m.SkalvektWidget), { ssr: false, loading: Loading }),
  grafisk: dynamic(() => import("./grafisk").then((m) => m.GrafiskWidget), { ssr: false, loading: Loading }),
  lan: dynamic(() => import("./lan").then((m) => m.LanWidget), { ssr: false, loading: Loading }),
  sparing: dynamic(() => import("./sparing").then((m) => m.SparingWidget), { ssr: false, loading: Loading }),
  indeks: dynamic(() => import("./indeks").then((m) => m.IndeksWidget), { ssr: false, loading: Loading }),
  sektor: dynamic(() => import("./sektor").then((m) => m.SektorWidget), { ssr: false, loading: Loading }),
  formlikhet: dynamic(() => import("./formlikhet").then((m) => m.FormlikhetWidget), { ssr: false, loading: Loading }),
  pytagoras: dynamic(() => import("./pytagoras").then((m) => m.PytagorasWidget), { ssr: false, loading: Loading }),
  volum: dynamic(() => import("./volum").then((m) => m.VolumWidget), { ssr: false, loading: Loading }),
  standardform: dynamic(() => import("./standardform").then((m) => m.StandardformWidget), { ssr: false, loading: Loading }),
  stigning: dynamic(() => import("./stigning").then((m) => m.StigningWidget), { ssr: false, loading: Loading }),
};

export const WIDGET_NAMES = Object.keys(W);

export function Widget({ name, props }: { name: string; props: Record<string, string> }) {
  const C = W[name];
  if (!C) return <p className="text-sm text-destructive">Ukjent widget: {name}</p>;
  return <C props={props} />;
}
