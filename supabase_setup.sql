-- K-MOLTBOOK 데이터베이스 스키마

-- prompts 테이블
CREATE TABLE IF NOT EXISTS prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_prompts_category ON prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_views ON prompts(views DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_title ON prompts USING GIN (to_tsvector('korean', title));

-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_views(prompt_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE prompts SET views = views + 1 WHERE id = prompt_id;
END;
$$ LANGUAGE plpgsql;

-- 샘플 데이터
INSERT INTO prompts (title, content, category, tags) VALUES
(
  '블로그 글 작성 프롬프트',
  '당신은 전문 블로그 작가입니다. 다음 주제에 대한 매력적인 블로그 글을 작성해 주세요:
  
  주제: [주제 입력]
  타겟 독자: [타겟 입력]
  
  구성:
  1. 매력적인 도입부 (후킹 문구 포함)
  2. 본문 3-4단락 (실용적인 팁 포함)
  3. 행동 촉구 (CTA)로 마무리
  
  글의 길이는 1500~2000자로 해주세요.',
  'copywriting',
  ARRAY['ChatGPT', '블로그', '글쓰기', '마케팅']
),
(
  '마케팅 카피 작성',
  '전문 마케터로서 다음 제품을 위한 설득력 있는 카피를 작성해 주세요:
  
  제품명: [제품명]
  타겟 고객: [타겟]
  USP: [고유 판매 제안]
  
  형식:
  - 헤드라인 3가지 (후킹 문구)
  - 바디카피 1단락 (혜택 강조)
  - CTA 문구',
  'marketing',
  ARRAY['ChatGPT', '카피라이팅', '마케팅', '세일즈']
),
(
  'React 컴포넌트 코드 작성',
  'TypeScript로 다음 요구사항을 충족하는 React 컴포넌트를 작성해 주세요:
  
  컴포넌트명: [컴포넌트명]
  기능:
  1. [기능 1]
  2. [기능 2]
  3. [기능 3]
  
  조건:
  - TypeScript 사용
  - Props 인터페이스 정의
  - 접근성 고려 (aria 속성)
  - Tailwind CSS 스타일링',
  'coding',
  ARRAY['ChatGPT', 'React', 'TypeScript', '개발']
),
(
  '이메일 캠페인 작성',
  '이메일 마케팅 전문가로서 오픈율 40% 이상의 이메일을 작성해 주세요:
  
  캠페인 목적: [목적]
  타겟 오디언스: [타겟]
  제공해야 할 정보: [정보]
  
  구성:
  1. 제목 (A/B 테스트용 3가지)
  2. 프리헤더
  3. 본문 (스캔 가능한 단락 구조)
  4. 명확한 CTA',
  'marketing',
  ARRAY['ChatGPT', '이메일', '마케팅', '뉴스레터']
),
(
  'YouTube 스크립트 작성',
  '유튜브 채널 운영자로서 다음 영상용 스크립트를 작성해 주세요:
  
  영상 주제: [주제]
  영상 길이: [분]
  채널 톤앤매너: [톤앤매너]
  
  스크립트 구조:
  1. 인트로 (후킹 + 채널 소개)
  2. 본론 (메인 컨텐츠)
  3. 아웃트로 (구독 요청 + 다음 영상 티저)
  
  화면 표시 (예: [화면: 그래프])를 포함해 주세요.',
  'copywriting',
  ARRAY['ChatGPT', '유튜브', '스크립트', '영상 제작']
),
(
  'SQL 쿼리 작성',
  '데이터베이스 개발자로서 다음 요구사항을 충족하는 SQL 쿼리를 작성해 주세요:
  
  테이블 구조: [구조]
  원하는 결과: [결과]
  
  조건:
  - PostgreSQL 문법 사용
  - 최적화된 쿼리 (인덱스 활용)
  - 주석으로 로직 설명',
  'coding',
  ARRAY['ChatGPT', 'SQL', '데이터베이스', '개발']
),
(
  '포트폴리오 자기소개서',
  '프리랜서/개발자를 위한 매력적인 자기소개서를 작성해 주세요:
  
  분야: [분야]
  경력 기간: [기간]
  주요 프로젝트: [프로젝트]
  강점: [강점]
  
  형식:
  - 한 문장 후킹 오프닝
  - 경력 강점 3가지 (구체적 예시 포함)
  - 작업 스타일
  - 마무리 포부
  
  글의 길이는 800~1000자로 해주세요.',
  'daily',
  ARRAY['ChatGPT', '자기소개', '포트폴리오', '커리어']
),
(
  '소셜 미디어 캡션 작성',
  '소셜 미디어 매니저로서 인스타그램용 캡션을 작성해 주세요:
  
  이미지 내용: [내용]
  브랜드 톤앤매너: [톤]
  해시태그 목적: [목적]
  
  포함 사항:
  - 매력적인 캡션 (100~150자)
  - 관련 해시태그 10~15개
  - 질문형 CTA로 댓글 유도',
  'marketing',
  ARRAY['ChatGPT', '소셜미디어', '인스타그램', '마케팅']
);
