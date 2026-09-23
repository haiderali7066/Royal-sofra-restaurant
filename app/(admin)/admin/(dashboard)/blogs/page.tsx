import Link from 'next/link'
import { Pencil, Plus } from 'lucide-react'
import { AdminPageHeading } from '@/components/admin-page-heading'
import { blogPostsCollection } from '@/lib/collections'
import { statusTone } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function AdminBlogsPage() {
  const blogs = await blogPostsCollection()
  const posts = await blogs.find({}).sort({ date: -1 }).toArray()

  return (
    <>
      <AdminPageHeading
        title="Blogs"
        description="Publish kitchen stories, recipes and restaurant news."
        action={
          <Link href="/admin/blogs/new" className="inline-flex items-center gap-2 rounded-full bg-cta px-5 py-2.5 text-sm font-semibold text-cta-foreground">
            <Plus size={16} /> New post
          </Link>
        }
      />
      {posts.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No blog posts yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Author</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                  <td className="px-5 py-4 font-medium">{post.title}</td>
                  <td className="px-5 py-4 text-muted-foreground">{post.category}</td>
                  <td className="px-5 py-4 text-muted-foreground">{post.author}</td>
                  <td className="px-5 py-4 text-muted-foreground">{post.date}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(post.published ? 'Active' : 'Suspended')}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/blogs/${post.id}/edit`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                      <Pencil size={13} /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
