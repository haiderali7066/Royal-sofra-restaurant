import { AdminPageHeading } from '@/components/admin-page-heading'
import { AdminCheckoutSettingsForm } from '@/components/admin-checkout-settings-form'
import { Button } from '@/components/ui/button'
import { brand } from '@/lib/mock-data'
import { getSiteSettings } from '@/lib/settings'

export const dynamic = 'force-dynamic'

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeading title="Settings" description="Manage restaurant profile, integrations and preferences." />

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Restaurant profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Field label="Restaurant name" defaultValue={brand.name} />
          <Field label="Tagline" defaultValue={brand.tagline} />
          <Field label="Restaurant type" defaultValue={brand.type} />
          <Field label="Contact phone" defaultValue={brand.phone} />
          <Field label="Address" defaultValue={brand.address} />
          <Field label="Operating hours" defaultValue={brand.hours} />
        </div>
        <Button className="mt-5">Save profile</Button>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Checkout &amp; payments</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Control delivery pricing, tax and which payment methods customers can choose at checkout.
        </p>
        <AdminCheckoutSettingsForm initialSettings={settings} />
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Integrations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connection status for services that power orders, media and payments. Credentials are managed via project environment variables.
        </p>
        <div className="mt-4 flex flex-col gap-3">
          <IntegrationRow
            name="MongoDB"
            description="Primary database for orders, menu and customers."
            status={process.env.MONGODB_URI ? 'Connected' : 'Not connected'}
          />
          <IntegrationRow
            name="Cloudinary"
            description="Image hosting for menu items and blog posts."
            status={process.env.CLOUDINARY_CLOUD_NAME ? 'Connected' : 'Not connected'}
          />
          <IntegrationRow
            name="GoPayfast"
            description="Card, EasyPaisa and JazzCash payments at checkout (Pakistan)."
            status={process.env.GOPAYFAST_MERCHANT_ID && process.env.GOPAYFAST_SECURED_KEY ? 'Connected' : 'Not connected'}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-serif text-xl">Notification preferences</h2>
        <div className="mt-4 flex flex-col gap-3 text-sm">
          <Toggle label="Email me on new orders" defaultChecked />
          <Toggle label="SMS alerts for low inventory" defaultChecked />
          <Toggle label="Weekly performance summary" />
        </div>
        <Button className="mt-5">Save preferences</Button>
      </section>
    </div>
  )
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      <input
        defaultValue={defaultValue}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  )
}

function IntegrationRow({ name, description, status }: { name: string; description: string; status: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">{status}</span>
    </div>
  )
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3">
      <span>{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="size-4 accent-primary" />
    </label>
  )
}
