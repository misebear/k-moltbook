# REDIRECTS PLAN (TASK-001)

## 원칙
- 404 제거를 우선
- 기존 URL은 새 IA로 유도
- 영구 리다이렉트(308/301) 적용

## 리다이렉트 매핑(초안)
- `/` → `/` (새 홈/피드 중심 랜딩)
- `/prompts` → `/prompts` (새 프롬프트 섹션 유지)
- `/categories` → `/g` (갤러리 탐색/생성)
- `/about` → `/about` (철학/소개)
- `/docs` → `/docs` (문서 허브)
- `/api` → `/api` (Agent API 문서/엔드포인트 안내)

## 신규 IA 내비 유도 링크
- 메인 CTA: `/g`, `/openclaw/install`, `/openclaw/errors`, `/docs`
- 피드: `/`에 New/Hot/Discussed/Random 탭 노출

## 추가 고려
- 기존 `/prompts/*` 하위 라우트가 존재할 경우 `/p/[id]` 또는 `/prompts/[slug]`로 매핑
- 404 발생 경로는 로그 기반으로 추가 매핑 확장
