import { notFound } from 'next/navigation'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { AdminBlogPostForm } from '@/components/admin-blog-post-form'
import { blogPostsCollection } from '@/lib/collections'

export const dynamic = 'force-dynamic'

export default async function AdminEditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const blogs = await blogPostsCollection()
  const post = await blogs.findOne({ id })
  if (!post) notFound()

  return (
    <>
      <AdminPageHeading title={`Edit "${post.title}"`} description="Update this journal post." />
      <AdminBlogPostForm post={post} />
    </>
  )
}
