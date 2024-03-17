import React from 'react'
import Link from 'next/link'

export const Footer: React.FC<{}> = () => {
  const year = new Date().getFullYear()
  return (
    <div className="flex flex-col items-center border-t border-t-neutral-200 pb-8 pt-4 text-xs font-thin leading-relaxed">
      <Link href="/privacy-policy">隱私政策</Link>
      <div>Copyright @ {year}</div>
    </div>
  )
}
