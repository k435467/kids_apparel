/**
 * @example
 * currencyFormat(89900) // returns '$89,900'
 */
export const currencyFormat = (value: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(value)
}
