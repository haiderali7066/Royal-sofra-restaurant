import { menuItemsCollection, blogPostsCollection } from '@/lib/collections'
import { homeCategories, promoCards } from '@/lib/mock-data'
import { HeroSlider } from '@/components/home/hero-slider'
import { MenuCategoryScroll } from '@/components/home/menu-category-scroll'
import { SignatureCarousel } from '@/components/home/signature-carousel'
import { PromoGrid } from '@/components/home/promo-grid'
import { FreshInsights } from '@/components/home/fresh-insights'
import { AppDownload } from '@/components/home/app-download'
import { OffersNewsletter } from '@/components/home/offers-newsletter'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const menu = await menuItemsCollection()
  const allItems = await menu.find({}).toArray()

  const categories: { title: string; image: string }[] = homeCategories
    .map((category) => {
      const match = allItems.find((item) => item.category === category)
      return match ? { title: category as string, image: match.image } : null
    })
    .filter((c): c is { title: string; image: string } => c !== null)

  const featured = allItems.filter((item) => item.isFeatured)
  const signatureDishes = (featured.length > 0 ? featured : allItems).slice(0, 4).map((item) => ({
    slug: item.slug,
    title: item.name,
    description: item.description,
    image: item.image,
  }))

  const blogs = await blogPostsCollection()
  const posts = await blogs
    .find({ published: true })
    .sort({ date: -1 })
    .limit(4)
    .toArray()

  return (
    <>
      <HeroSlider />
      {categories.length > 0 && <MenuCategoryScroll categories={categories} />}
      {signatureDishes.length > 0 && <SignatureCarousel dishes={signatureDishes} />}
      <PromoGrid promos={promoCards} />
      <FreshInsights posts={posts} />
      <AppDownload />
      <OffersNewsletter />
    </>
  )
}
