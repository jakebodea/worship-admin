export function SectionLabel({ title, count }: { title: string; count: number }) {
  return (
    <div className="sticky top-0 z-10 -mx-1 flex items-baseline gap-2 bg-background/95 px-1 pb-1.5 pt-1 backdrop-blur">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <span className="text-sm tabular-nums text-muted-foreground/60">{count}</span>
    </div>
  );
}
