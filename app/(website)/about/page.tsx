import { BookOpen, ChefHat, Sparkles } from 'lucide-react'
import { PageHeading } from '@/components/page-heading'

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
      <PageHeading
        eyebrow="Our story"
        title="A sofrah is more than a table. It is an invitation."
        copy="Royal Sofra began with a simple belief: the best meals are generous, unhurried and shared. We bring together the deep comfort of Pakistani cooking, the fire of the BBQ and the energy of the wok."
      />
      <div className="mt-16 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 text-primary"><ChefHat /></div>
          <h3 className="font-serif text-2xl">Made with patience</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Our gravies simmer, our marinades rest and every naan is stretched to order.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 text-primary"><Sparkles /></div>
          <h3 className="font-serif text-2xl">A little theatre</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">From the first charcoal smoke to the final garnish, every plate has a moment.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-5 text-primary"><BookOpen /></div>
          <h3 className="font-serif text-2xl">Recipes with roots</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Classic flavours, refined for the way modern families love to dine.</p>
        </div>
      </div>
    </section>
  )
}
