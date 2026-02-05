'use client'

import { Prompt } from '@/lib/types'
import { Copy, Check, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function PromptDetail({ prompt }: { prompt: Prompt }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          목록으로
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-4">{prompt.title}</h1>
          
          <div className="flex gap-2 mb-6">
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
              {prompt.category}
            </span>
            {prompt.tags.map((tag) => (
              <span key={tag} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>

          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-6">
            <pre className="whitespace-pre-wrap text-sm dark:text-gray-300">
              {prompt.content}
            </pre>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition w-full justify-center"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            {copied ? '복사 완료!' : '프롬프트 복사'}
          </button>
        </div>
      </div>
    </div>
  )
}
