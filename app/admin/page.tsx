'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    await supabase.from('prompts').insert({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()),
      views: 0,
    })

    alert('프롬프트가 등록되었습니다.')
    setFormData({ title: '', content: '', category: '', tags: '' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">프롬프트 등록</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">프롬프트 내용</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg h-48 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">카테고리</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
              required
            >
              <option value="">선택하세요</option>
              <option value="copywriting">카피라이팅</option>
              <option value="marketing">마케팅</option>
              <option value="coding">코딩</option>
              <option value="education">교육</option>
              <option value="daily">일상</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">태그 (쉼표로 구분)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="ChatGPT, 글쓰기, 마케팅"
              className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium"
          >
            등록하기
          </button>
        </form>
      </div>
    </div>
  )
}
