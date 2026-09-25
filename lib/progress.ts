"use client";

import { useSyncExternalStore } from "react";

export type ExStatus = "done" | "review";

export type Progress = {
  ex: Record<string, ExStatus>;
  read: Record<string, number>; // seksjon -> tidspunkt
  drills: Record<string, { right: number; total: number; streak: number; best: number }>;
  last?: { href: string; title: string; at: number };
};

const KEY = "2p-progress-v1";
const EMPTY: Progress = { ex: {}, read: {}, drills: {} };

let state: Progress = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    /* privat modus o.l. */
  }
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      try {
        state = e.newValue ? { ...EMPTY, ...JSON.parse(e.newValue) } : EMPTY;
      } catch {
        state = EMPTY;
      }
      listeners.forEach((l) => l());
    }
  });
}

function save() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignorer */
  }
  listeners.forEach((l) => l());
}

export function update(fn: (p: Progress) => Progress) {
  load();
  state = fn(state);
  save();
}

function subscribe(l: () => void) {
  load();
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useProgress(): Progress {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => EMPTY,
  );
}

export function setExStatus(id: string, s: ExStatus | null) {
  update((p) => {
    const ex = { ...p.ex };
    if (s) ex[id] = s;
    else delete ex[id];
    return { ...p, ex };
  });
}

export function markRead(section: string, on = true) {
  update((p) => {
    const read = { ...p.read };
    if (on) read[section] = Date.now();
    else delete read[section];
    return { ...p, read };
  });
}

export function setLast(href: string, title: string) {
  update((p) => ({ ...p, last: { href, title, at: Date.now() } }));
}

export function recordDrill(topic: string, right: boolean) {
  update((p) => {
    const d = p.drills[topic] ?? { right: 0, total: 0, streak: 0, best: 0 };
    const streak = right ? d.streak + 1 : 0;
    return {
      ...p,
      drills: { ...p.drills, [topic]: { right: d.right + (right ? 1 : 0), total: d.total + 1, streak, best: Math.max(d.best, streak) } },
    };
  });
}

export function resetProgress() {
  update(() => EMPTY);
}
