import { AdminPageHeading } from '@/components/admin-page-heading'
import { AdminBlogPostForm } from '@/components/admin-blog-post-form'

export default function AdminNewBlogPage() {
  return (
    <>
      <AdminPageHeading title="New blog post" description="Write a new story for the Royal Sofra journal." />
      <AdminBlogPostForm />
    </>
  )
}
