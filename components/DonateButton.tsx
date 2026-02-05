'use client'

import { Coffee } from 'lucide-react'

export function DonateButton() {
  return (
    <div className="mt-2 text-center">
      <a
        href="https://www.buymeacoffee.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-medium transition"
      >
        <Coffee className="w-4 h-4" />
        커피 한 잔 후원하기
      </a>
    </div>
  )
}
