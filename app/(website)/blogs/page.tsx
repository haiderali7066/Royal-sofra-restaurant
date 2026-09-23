import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageHeading } from '@/components/page-heading'
import { blogPostsCollection } from '@/lib/collections'

export const dynamic = 'force-dynamic'

export default async function BlogsPage() {
  const blogs = await blogPostsCollection()
  const published = await blogs.find({ published: true }).sort({ date: -1 }).toArray()

  return (
    <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <PageHeading eyebrow="The journal" title="Stories from the sofrah." copy="Kitchen notes, family recipes and a closer look at the craft behind the plate." />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {published.map((post) => (
          <Link key={post.id} href={`/blogs/${post.slug}`} className="group overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={post.image} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-primary">
                <span>{post.category}</span>
                <span className="text-muted-foreground">{post.date}</span>
              </div>
              <h2 className="mt-4 font-serif text-2xl leading-tight">{post.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
              <span className="mt-6 inline-flex items-center text-sm font-semibold text-primary">
                Read story <ArrowRight className="ml-1" size={15} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
