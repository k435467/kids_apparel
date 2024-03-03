export const quantityOptions = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
]

export const quantityOptionsWithZero = [{ value: 0, label: '0' }, ...quantityOptions]

export type ShipMethodType = '7-11' | '全家' | '宅配'
