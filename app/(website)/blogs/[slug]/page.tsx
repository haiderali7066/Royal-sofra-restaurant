import { notFound } from 'next/navigation'
import Image from 'next/image'
import { blogPostsCollection } from '@/lib/collections'

export const dynamic = 'force-dynamic'

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const blogs = await blogPostsCollection()
  const post = await blogs.findOne({ slug, published: true })
  if (!post) notFound()

  return (
    <article className="mx-auto max-w-3xl px-5 py-14 md:px-8 md:py-20">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-primary">
        <span>{post.category}</span>
        <span className="text-muted-foreground">{post.date}</span>
      </div>
      <h1 className="mt-4 text-balance font-serif text-4xl leading-tight md:text-5xl">{post.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">By {post.author}</p>
      <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl">
        <Image src={post.image} alt={post.title} fill className="object-cover" priority />
      </div>
      <p className="mt-8 text-pretty text-lg leading-8 text-muted-foreground">{post.content}</p>
    </article>
  )
}
