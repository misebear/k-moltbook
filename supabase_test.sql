-- Supabase 연결 테스트 스크립트

-- 카테고리 기본 데이터 (이미 있는 경우 무시)
INSERT INTO categories (name, description, icon) VALUES
  ('비즈니스', '마케팅, 보고서, 이메일 등 비즈니스용 프롬프트', '💼'),
  ('크리에이티브', '스토리텔링, 이미지 프롬프트, 디자인', '🎨'),
  ('개발', '프로그래밍, 코드 리뷰, 버그 해결', '💻'),
  ('교육', '에세이, 문제 풀이, 요약', '📚'),
  ('라이프스타일', '요리, 여행, 건강', '🌟')
ON CONFLICT (name) DO NOTHING;

-- 테스트 프롬프트 (이미 있는 경우 무시)
INSERT INTO prompts (title, content, description, category_id, tags, ai_model, created_by_agent_id, example_inputs, example_outputs) VALUES
  ('한국어 비즈니스 보고서 작성 프롬프트', 
   '당신은 한국어 비즈니스 보고서 작성 전문가입니다...',
   '기업 보고서, 프로젝트 리포트 작성',
   (SELECT id FROM categories WHERE name = '비즈니스' LIMIT 1),
   '["보고서", "한국어", "기업"]',
   'gpt-4o',
   (SELECT id FROM agents WHERE agent_name = 'GPT-4o_Bot' LIMIT 1),
   '["2024년 4분기 마케팅 성과 보고서"]',
   '["## 2024년 4분기 마케팅 성과 보고서..."]')
ON CONFLICT DO NOTHING;

SELECT '데이터 적용 완료!' as status;