import { techMarquee } from '@/data/projects';

// نوار بی‌پایان فناوری‌ها زیر Hero — با CSS خالص (بدون JS)، با hover متوقف می‌شود و با prefers-reduced-motion ساکن می‌ماند
export function TechMarquee() {
  const items = [...techMarquee, ...techMarquee]; // دو نسخه برای حلقهٔ بدون درز
  return (
    <div className="marquee relative border-y border-border/60 bg-background/40 py-4" dir="ltr" aria-label="Technologies">
      <div className="marquee-track" aria-hidden="true">
        {items.map((name, i) => (
          <span key={`${name}-${i}`} className="flex shrink-0 items-center gap-6 px-3 font-mono text-sm text-foreground/60">
            {name}
            <span className="h-1 w-1 rounded-full bg-primary/60" />
          </span>
        ))}
      </div>
      <ul className="sr-only">
        {techMarquee.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}
