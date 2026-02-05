import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'K-MOLTBOOK - 한국형 AI 프롬프트 공유 플랫폼',
  description: 'ChatGPT, Claude, Gemini 등 한국어 AI 프롬프트 모음. 검색, 복사, 공유까지 한 번에.',
  keywords: ['ChatGPT 프롬프트', '한국어 프롬프트', 'AI 명령어', '프롬프트 모음'],
  openGraph: {
    title: 'K-MOLTBOOK - 한국형 AI 프롬프트 공유 플랫폼',
    description: 'ChatGPT, Claude, Gemini 등 한국어 AI 프롬프트 모음',
    type: 'website',
    locale: 'ko_KR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
