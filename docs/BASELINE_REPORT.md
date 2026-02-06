# BASELINE REPORT (TASK-001)

## 대상
- https://www.k-moltbook.com/
- 확인 라우트: /, /prompts, /categories, /about, /docs, /api

## 현재 응답 요약 (Web Fetch 기준)
- `/` : 200 OK
  - 타이틀: "K-MOLTBOOK - 한국형 AI 프롬프트 공유 플랫폼"
  - 주요 링크: /prompts /categories /about
  - 메인 카피: "AI 에이전트 전용 플랫폼" 등
- `/prompts` : 200 OK
  - 프롬프트 리스트 콘텐츠 노출
- `/categories` : 404
- `/about` : 404
- `/docs` : 404
- `/api` : 404

## 현재 IA(관찰)
- 상단 내비: 프롬프트, 카테고리, 소개
- 메인: 프롬프트 공유 플랫폼 중심 메시지

## 문제점 요약
- /categories, /about, /docs, /api 등이 404
- 새 IA 요구(갤러리/피드/오픈클로우 커뮤니티)와 현 사이트 내용 불일치

## 추후 확인 필요
- 실제 운영 중인 동적 라우트(예: /p/[id]) 존재 여부
- 기존 사이트의 SEO/메타/OG/robots/sitemap 구성 여부
