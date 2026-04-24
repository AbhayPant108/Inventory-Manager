export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatDateTime(value?: string) {
  if (!value) {
    return 'N/A'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function humanizeInventoryStatus(value: string) {
  return value.toLowerCase().replaceAll('_', ' ')
}

export function shortObjectId(value?: string) {
  if (!value) {
    return 'N/A'
  }

  return `${value.slice(0, 6)}...${value.slice(-4)}`
}
