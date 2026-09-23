import Image from 'next/image'
import Link from 'next/link'
import type { BlogPost } from '@/lib/types'

export function FreshInsights({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null

  return (
    <section className="bg-secondary py-16 md:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:mb-20 md:flex-row">
          <div className="hidden flex-1 md:block" />
          <div className="text-center">
            <h2 className="text-4xl font-light uppercase leading-none tracking-tight text-foreground md:text-[4rem]">
              FRESH <br />
              <span className="ml-0 text-5xl font-normal normal-case text-foreground md:ml-8 md:text-[5rem]">
                <span className="font-serif italic">Insights</span>
              </span>
            </h2>
          </div>
          <div className="hidden flex-1 md:flex" />
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {posts.map((post) => (
            <Link href={`/blogs/${post.slug}`} key={post.id} className="group flex flex-col">
              <div className="relative mb-4 aspect-[4/5] w-full overflow-hidden bg-background md:mb-6">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                />
              </div>
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}
              </span>
              <h3 className="mb-4 pr-2 text-lg font-light leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl">
                {post.title}
              </h3>
              <div className="mt-auto">
                <span className="inline-flex items-center gap-2 border-b border-foreground pb-1 text-[11px] font-bold uppercase tracking-[0.15em] text-foreground transition-colors group-hover:border-primary group-hover:text-primary">
                  Read article
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
