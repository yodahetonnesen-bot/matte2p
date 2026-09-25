"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// Melder sidebytter inne i appen (klientnavigering) til /api/side, som sender dem
// videre til admin-sida. Første visning er allerede telt av vakta på serveren.
export function Sidebruk() {
  const sti = usePathname();
  const forste = useRef(true);
  useEffect(() => {
    if (forste.current) {
      forste.current = false;
      return;
    }
    fetch("/api/side", {
      method: "POST",
      credentials: "same-origin",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sti }),
    }).catch(() => {});
  }, [sti]);
  return null;
}
