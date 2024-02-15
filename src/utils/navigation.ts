import { ReadonlyURLSearchParams } from 'next/navigation'

/**
 * Does not include the question mark.
 */
export const createQs = (
  params: URLSearchParams | ReadonlyURLSearchParams,
  update: {
    set?: { [key: string]: string }
    delete?: string[]
  },
) => {
  const p = new URLSearchParams(params)

  // Set
  if (update.set) {
    const setEntries = Object.entries(update.set)
    setEntries.forEach(([k, v]) => {
      p.delete(k)
      p.append(k, v)
    })
  }

  // Unset
  if (update.delete) {
    update.delete.forEach((k) => p.delete(k))
  }

  return p.toString()
}

/**
 * 
 */
export const createUrl = (
  pathname: string,
  params: URLSearchParams | ReadonlyURLSearchParams,
  update: {
    set?: { [key: string]: string }
    delete?: string[]
  },
) => {
  const qs = createQs(params, update)

  return qs.length > 0 ? `${pathname}?${qs}` : pathname
}
