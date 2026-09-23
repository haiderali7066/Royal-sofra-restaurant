export function PageHeading({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-balance font-serif text-5xl leading-tight tracking-tight md:text-7xl">{title}</h1>
      <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground">{copy}</p>
    </div>
  )
}
