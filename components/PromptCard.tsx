'use client'

import { Prompt } from '@/lib/types'
import Link from 'next/link'
import { Eye, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export function PromptCard({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <Link href={`/prompt/${prompt.id}`}>
          <h3 className="text-lg font-semibold hover:text-blue-600 transition">
            {prompt.title}
          </h3>
        </Link>
        <div className="flex items-center text-gray-500 text-sm">
          <Eye className="w-4 h-4 mr-1" />
          {prompt.views}
        </div>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
        {prompt.content}
      </p>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {prompt.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded">
              #{tag}
            </span>
          ))}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
    </div>
  )
}
