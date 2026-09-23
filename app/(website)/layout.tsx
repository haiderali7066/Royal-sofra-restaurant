import { CartProvider } from '@/components/cart-context'
import { CartDrawer } from '@/components/cart-drawer'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <CartDrawer />
    </CartProvider>
  )
}
