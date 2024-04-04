import { Dayjs } from 'dayjs'

/**
 * @example
 * formatCurrency(89900) // returns '$89,900'
 */
export const formatCurrency = (value: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value)
}

export const formatPriceRange = (price: { min: number; max: number }) => {
  if (price.min === price.max) {
    return `${formatCurrency(price.min)}`
  } else {
    return `${formatCurrency(price.min)} ~ ${formatCurrency(price.max)}`
  }
}

export const formatDayjsToUTCDayStart = (d?: Dayjs) =>
  d ? d.subtract(1, 'day').format('YYYY-MM-DD') + 'T16:00:00.000Z' : undefined
export const formatDayjsToUTCDayEnd = (d?: Dayjs) =>
  d ? d.format('YYYY-MM-DD') + 'T16:00:00.000Z' : undefined
