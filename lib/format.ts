export function money(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function statusTone(status: string): string {
  switch (status) {
    case 'Delivered':
    case 'Approved':
    case 'Active':
      return 'bg-primary/10 text-primary'
    case 'Cancelled':
    case 'Rejected':
    case 'Suspended':
      return 'bg-destructive/10 text-destructive'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

// Finer-grained tones for the multi-stage order fulfillment pipeline, where a
// flat "muted" default for every non-terminal state reads as visually inert.
export function orderStatusTone(status: string): string {
  switch (status) {
    case 'Pending':
      return 'bg-amber-100 text-amber-800'
    case 'Confirmed':
      return 'bg-blue-100 text-blue-800'
    case 'Preparing':
      return 'bg-violet-100 text-violet-800'
    case 'Out for delivery':
      return 'bg-cyan-100 text-cyan-800'
    case 'Delivered':
      return 'bg-primary/10 text-primary'
    case 'Cancelled':
      return 'bg-destructive/10 text-destructive'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function paymentStatusTone(status: string): string {
  switch (status) {
    case 'Paid':
      return 'bg-primary/10 text-primary'
    case 'Failed':
      return 'bg-destructive/10 text-destructive'
    default:
      return 'bg-amber-100 text-amber-800'
  }
}
