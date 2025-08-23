// Link parsing utilities and types
import { contentService, parseUrl, type Content } from './api'

export interface LinkMetadata {
  url: string
  title: string
  description: string
  image?: string
  domain: string
  favicon?: string
  publishedAt?: string
  author?: string
}

export interface ParsedContent {
  id: string
  metadata: LinkMetadata
  content: string
  isAiEnhanced: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
  shareCount: number
  status: "draft" | "published" | "archived"
}

// 转换API响应到前端格式的辅助函数
function convertApiContentToFrontend(apiContent: Content): ParsedContent {
  return {
    id: apiContent.id.toString(),
    metadata: {
      url: apiContent.url,
      title: apiContent.title,
      description: apiContent.description,
      image: apiContent.images?.[0],
      domain: new URL(apiContent.url).hostname,
      favicon: `/placeholder.svg?height=32&width=32&query=${new URL(apiContent.url).hostname} favicon`,
    },
    content: apiContent.content || apiContent.description,
    isAiEnhanced: apiContent.parse_type === 'ai_enhanced',
    tags: apiContent.tags || [],
    createdAt: apiContent.created_at,
    updatedAt: apiContent.updated_at,
    shareCount: 0, // 需要从后端获取分享统计
    status: apiContent.status
  }
}

// 真实的链接解析服务，替换原有的mock服务
export const linkParser = {
  async parseUrl(url: string, groupId: number = 1): Promise<LinkMetadata> {
    try {
      const response = await parseUrl(url, groupId, false)
      
      return {
        url: response.parse_result.platform,
        title: response.parse_result.title,
        description: response.parse_result.description,
        image: response.parse_result.images?.[0],
        domain: new URL(url).hostname,
        favicon: `/placeholder.svg?height=32&width=32&query=${new URL(url).hostname} favicon`,
      }
    } catch (error) {
      console.error('Parse URL error:', error)
      throw error
    }
  },

  async enhanceWithAI(content: ParsedContent): Promise<ParsedContent> {
    try {
      const enhancedContent = await contentService.enhanceWithAI(parseInt(content.id))
      return convertApiContentToFrontend(enhancedContent)
    } catch (error) {
      console.error('AI enhance error:', error)
      throw error
    }
  },
}

// 示例：获取内容详情的函数 - 实现GET /api/v1/protected/contents/13
export async function getContentExample(): Promise<ParsedContent> {
  try {
    // 调用真实的API获取ID为13的内容
    const content = await contentService.getContent(13)
    return convertApiContentToFrontend(content)
  } catch (error) {
    console.error('Get content 13 error:', error)
    throw error
  }
}
