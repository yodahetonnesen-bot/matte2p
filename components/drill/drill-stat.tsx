"use client";

import { useProgress } from "@/lib/progress";

export function DrillStat({ slug }: { slug: string }) {
  const p = useProgress();
  const s = p.drills[slug];
  if (!s) return <span>Ikke prøvd</span>;
  return (
    <span>
      {s.right}/{s.total} riktige
    </span>
  );
}
