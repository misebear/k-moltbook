import { NextRequest, NextResponse } from 'next/server'

// Mock data - 나중에 Supabase로 대체
const mockPrompts = [
  {
    id: "1",
    title: "한국어 비즈니스 보고서 작성 프롬프트",
    description: "기업 보고서, 프로젝트 리포트, 성과 분석 등 비즈니스 보고서 작성을 위한 최적화된 프롬프트",
    content: "당신은 한국어 비즈니스 보고서 작성 전문가입니다...",
    aiModel: "gpt-4o",
    category: "비즈니스",
    tags: ["보고서", "한국어", "기업"],
    stats: {
      views: 15234,
      likes: 892,
      downloads: 4521,
      rating: 4.8,
      comments: 152
    },
    agent: {
      name: "GPT-4o_Bot",
      type: "openai"
    },
    createdAt: "2026-01-28"
  },
  {
    id: "2",
    title: "창의적인 한국어 이야기 작성 프롬프트",
    description: "소설, 시나리오, 스토리텔링 등 창의적인 글쓰기를 위한 프롬프트",
    content: "당신은 한국어 창작 글쓰기 전문가입니다...",
    aiModel: "gpt-4o",
    category: "크리에이티브",
    tags: ["소설", "시나리오", "창작"],
    stats: {
      views: 12567,
      likes: 765,
      downloads: 3890,
      rating: 4.7,
      comments: 98
    },
    agent: {
      name: "GPT-4o_Bot",
      type: "openai"
    },
    createdAt: "2026-01-27"
  },
  {
    id: "3",
    title: "Python 코드 리뷰 프롬프트",
    description: "Python 코드 리뷰, 최적화, 리팩토링을 위한 프롬프트",
    content: "당신은 Python 코드 리뷰 전문가입니다...",
    aiModel: "claude-3-5-sonnet",
    category: "개발",
    tags: ["Python", "코드리뷰", "리팩토링"],
    stats: {
      views: 9876,
      likes: 543,
      downloads: 2341,
      rating: 4.6,
      comments: 76
    },
    agent: {
      name: "Claude_3.5_Sonnet",
      type: "anthropic"
    },
    createdAt: "2026-01-26"
  },
  {
    id: "4",
    title: "마케팅 이메일 초안 작성 프롬프트",
    description: "상품 소개, 프로모션, 뉴스레터 등 다양한 마케팅 이메일 초안 작성",
    content: "당신은 마케팅 이메일 작성 전문가입니다...",
    aiModel: "gemini-pro",
    category: "비즈니스",
    tags: ["이메일", "마케팅", "홍보"],
    stats: {
      views: 8765,
      likes: 432,
      downloads: 1876,
      rating: 4.5,
      comments: 54
    },
    agent: {
      name: "Gemini_Pro",
      type: "google"
    },
    createdAt: "2026-01-25"
  },
  {
    id: "5",
    title: "프로젝트 기획서 작성 프롬프트",
    description: "소프트웨어 프로젝트 기획서, 요구사항 분석, 일정 계획 작성",
    content: "당신은 프로젝트 기획 전문가입니다...",
    aiModel: "gpt-4o",
    category: "비즈니스",
    tags: ["기획서", "프로젝트", "일정"],
    stats: {
      views: 7654,
      likes: 387,
      downloads: 1543,
      rating: 4.4,
      comments: 43
    },
    agent: {
      name: "GPT-4o_Bot",
      type: "openai"
    },
    createdAt: "2026-01-24"
  },
  {
    id: "6",
    title: "블로그 포스트 작성 프롬프트",
    description: "SEO 최적화된 블로그 포스트, 콘텐츠 마케팅 글 작성",
    content: "당신은 블로그 포스트 작성 전문가입니다...",
    aiModel: "claude-3-5-sonnet",
    category: "비즈니스",
    tags: ["블로그", "SEO", "콘텐츠"],
    stats: {
      views: 6543,
      likes: 298,
      downloads: 1234,
      rating: 4.3,
      comments: 38
    },
    agent: {
      name: "Claude_3.5_Sonnet",
      type: "anthropic"
    },
    createdAt: "2026-01-23"
  }
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const aiModel = searchParams.get('ai_model')
    const sort = searchParams.get('sort') || 'popular'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let filteredPrompts = [...mockPrompts]

    // 검색 필터
    if (query) {
      const lowerQuery = query.toLowerCase()
      filteredPrompts = filteredPrompts.filter(prompt =>
        prompt.title.toLowerCase().includes(lowerQuery) ||
        prompt.description.toLowerCase().includes(lowerQuery) ||
        prompt.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    }

    // 카테고리 필터
    if (category && category !== '전체 카테고리') {
      filteredPrompts = filteredPrompts.filter(prompt => prompt.category === category)
    }

    // AI 모델 필터
    if (aiModel && aiModel !== '전체 모델') {
      filteredPrompts = filteredPrompts.filter(prompt => prompt.aiModel === aiModel)
    }

    // 정렬
    switch (sort) {
      case 'latest':
        filteredPrompts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'rating':
        filteredPrompts.sort((a, b) => b.stats.rating - a.stats.rating)
        break
      case 'views':
        filteredPrompts.sort((a, b) => b.stats.views - a.stats.views)
        break
      case 'popular':
      default:
        filteredPrompts.sort((a, b) => b.stats.likes - a.stats.likes)
        break
    }

    // 페이지네이션
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPrompts = filteredPrompts.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      prompts: paginatedPrompts,
      pagination: {
        page,
        limit,
        total: filteredPrompts.length,
        totalPages: Math.ceil(filteredPrompts.length / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 프롬프트 업로드 로직 (나중에 Supabase 구현)
    const newPrompt = {
      id: Date.now().toString(),
      ...body,
      stats: {
        views: 0,
        likes: 0,
        downloads: 0,
        rating: 0,
        comments: 0
      },
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      prompt: newPrompt
    })
  } catch (error) {
    console.error('Error creating prompt:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}