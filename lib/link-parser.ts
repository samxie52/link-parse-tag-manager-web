// Link parsing utilities and types
import { contentService } from './api/content-service'
import type { ParseResponse, ParseResultData, BasicParseResult } from './api/api-types'

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

// 转换新的解析结果到前端格式
function convertParseResultToLinkMetadata(parseResult: ParseResultData, originalUrl: string): LinkMetadata {
  return {
    url: originalUrl,
    title: parseResult.basic.title,
    description: parseResult.basic.description,
    image: parseResult.basic.images?.[0] || parseResult.basic.thumbnail,
    domain: new URL(originalUrl).hostname,
    favicon: `/placeholder.svg?height=32&width=32&query=${new URL(originalUrl).hostname} favicon`,
    publishedAt: parseResult.basic.published_at,
    author: parseResult.basic.author
  }
}

// 真实的链接解析服务
export const linkParser = {
  // 解析URL并返回完整的解析结果
  async parseUrlComplete(url: string, groupId: number = 1, forceAI: boolean = false): Promise<ParseResultData> {
    try {
      const response = await contentService.parseUrl({
        url,
        group_id: groupId,
        force_ai: forceAI
      })
      
      return response.parse_result
    } catch (error) {
      console.error('Parse URL error:', error)
      throw error
    }
  },

  // 解析URL并返回简化的元数据（保持向后兼容）
  async parseUrl(url: string, groupId: number = 1): Promise<LinkMetadata> {
    try {
      const parseResult = await this.parseUrlComplete(url, groupId, false)
      return convertParseResultToLinkMetadata(parseResult, url)
    } catch (error) {
      console.error('Parse URL error:', error)
      throw error
    }
  },

  // AI增强解析
  async parseUrlWithAI(url: string, groupId: number = 1, aiProvider?: string): Promise<ParseResultData> {
    try {
      const response = await contentService.parseUrl({
        url,
        group_id: groupId,
        force_ai: true,
        ai_provider: aiProvider as any
      })
      
      return response.parse_result
    } catch (error) {
      console.error('AI parse URL error:', error)
      throw error
    }
  },

  // 检查是否为支持的平台
  isSupportedPlatform(url: string): boolean {
    try {
      const domain = new URL(url).hostname.toLowerCase()
      const supportedDomains = [
        'xiaohongshu.com',
        'xhslink.com',
        'amap.com',
        'gaode.com'
      ]
      
      return supportedDomains.some(supported => domain.includes(supported))
    } catch {
      return false
    }
  },

  // 获取平台类型
  getPlatformType(url: string): string {
    try {
      const domain = new URL(url).hostname.toLowerCase()
      
      if (domain.includes('xiaohongshu.com') || domain.includes('xhslink.com')) {
        return 'xiaohongshu'
      }
      
      if (domain.includes('amap.com') || domain.includes('gaode.com')) {
        return 'amap'
      }
      
      return 'unknown'
    } catch {
      return 'unknown'
    }
  }
}

// 向后兼容的函数
export async function enhanceWithAI(content: ParsedContent): Promise<ParsedContent> {
  // 这个函数保持不变，用于向后兼容
  console.warn('enhanceWithAI is deprecated, use linkParser.parseUrlWithAI instead')
  return content
}

// 示例：获取内容详情的函数
export async function getContentExample(): Promise<ParsedContent> {
  try {
    // 这个函数保持不变，用于向后兼容
    const content = await contentService.getContent(13)
    
    return {
      id: content.id.toString(),
      metadata: {
        url: content.url,
        title: content.title,
        description: content.description,
        image: content.images?.[0],
        domain: new URL(content.url).hostname,
        favicon: `/placeholder.svg?height=32&width=32&query=${new URL(content.url).hostname} favicon`,
      },
      content: content.content || content.description,
      isAiEnhanced: content.parse_type === 'ai_enhanced',
      tags: content.tags || [],
      createdAt: content.created_at,
      updatedAt: content.updated_at,
      shareCount: 0,
      status: content.status
    }
  } catch (error) {
    console.error('Get content 13 error:', error)
    throw error
  }
}
