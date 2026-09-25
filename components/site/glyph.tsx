/** Et matematisk tegn brukt som markør (i stedet for bildeikoner). */
export function Glyph({ g, className = "" }: { g: string; className?: string }) {
  return (
    <span aria-hidden className={"md-glyph " + className}>
      {g}
    </span>
  );
}

/** Lager en ikon-komponent (samme API som lucide-ikonene) av et matematisk tegn. */
export function glyphIcon(g: string) {
  function GlyphIcon({ className = "" }: { className?: string }) {
    return (
      <span aria-hidden className={"glyph-icon " + className}>
        {g}
      </span>
    );
  }
  GlyphIcon.displayName = `Glyph(${g})`;
  return GlyphIcon;
}
