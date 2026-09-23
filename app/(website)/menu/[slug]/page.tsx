import { notFound } from 'next/navigation'
import Image from 'next/image'
import { menuItemsCollection } from '@/lib/collections'
import { ProductDetailClient } from './product-detail-client'

export const dynamic = 'force-dynamic'

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const menu = await menuItemsCollection()
  const doc = await menu.findOne({ slug })
  if (!doc) notFound()

  const item = {
    id: doc.id,
    slug: doc.slug,
    name: doc.name,
    category: doc.category,
    description: doc.description,
    price: doc.price,
    priceNote: doc.priceNote,
    options: doc.options,
    image: doc.image,
    tag: doc.tag,
    spiceLevel: doc.spiceLevel,
    isAvailable: doc.isAvailable,
    isFeatured: doc.isFeatured,
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-2 md:px-8 md:py-20">
      <div className="relative aspect-square overflow-hidden rounded-3xl">
        <Image src={item.image} alt={item.name} fill className="object-cover" priority />
      </div>
      <ProductDetailClient item={item} />
    </section>
  )
}
