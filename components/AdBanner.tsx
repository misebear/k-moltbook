'use client'

import { DonateButton } from './DonateButton'

export function AdBanner({ slot }: { slot: 'top' | 'sidebar-top' | 'sidebar-bottom' | 'bottom' }) {
  // 애드센스 승인 전에는 플레이스홀더 표시
  const adSenseApproved = false // 승인 후 true로 변경

  if (!adSenseApproved) {
    return (
      <div className="w-full">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center min-h-[90px] text-gray-500 text-sm">
          애드센스 승인 대기 중
        </div>
        <DonateButton />
      </div>
    )
  }

  // 승인 후 실제 애드센스 코드
  return (
    <div className="w-full">
      {/* Google AdSense 코드 - 승인 후 배치 */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot === 'top' ? 'XXXXXXXXXX' : slot === 'sidebar-top' ? 'XXXXXXXXXX' : 'XXXXXXXXXX'}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <DonateButton />
    </div>
  )
}
