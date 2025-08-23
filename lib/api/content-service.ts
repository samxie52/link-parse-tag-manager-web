// 内容服务 - 替换原有的mock link-parser服务
import { apiClient } from './api-client'
import type { 
  Content, 
  ParseRequest, 
  ParseResponse, 
  PaginatedResponse, 
  ContentFilters, 
  PaginationParams,
  SuccessResponse 
} from './api-types'

class ContentService {
  // 解析链接内容
  async parseUrl(request: ParseRequest): Promise<ParseResponse> {
    try {
      const response = await apiClient.post<SuccessResponse<ParseResponse>>('protected/contents/parse', request)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || '链接解析失败')
    } catch (error) {
      console.error('Parse URL error:', error)
      throw error
    }
  }

  // 获取内容列表
  async getContents(
    filters?: ContentFilters, 
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Content>> {
    try {
      const params: Record<string, string> = {}
      
      // 添加分页参数
      if (pagination?.page) params.page = pagination.page.toString()
      if (pagination?.page_size) params.page_size = pagination.page_size.toString()
      if (pagination?.sort_by) params.sort_by = pagination.sort_by
      if (pagination?.sort_order) params.sort_order = pagination.sort_order
      
      // 添加过滤参数
      if (filters?.platform?.length) params.platform = filters.platform.join(',')
      if (filters?.parse_type?.length) params.parse_type = filters.parse_type.join(',')
      if (filters?.tags?.length) params.tags = filters.tags.join(',')
      if (filters?.date_from) params.date_from = filters.date_from
      if (filters?.date_to) params.date_to = filters.date_to
      if (filters?.search) params.search = filters.search
      if (filters?.group_id) params.group_id = filters.group_id.toString()
      
      const response = await apiClient.get<SuccessResponse<PaginatedResponse<Content>>>(
        'protected/contents', 
        params
      )
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || '获取内容列表失败')
    } catch (error) {
      console.error('Get contents error:', error)
      throw error
    }
  }

  // 获取单个内容详情
  async getContent(id: number): Promise<Content> {
    try {
      const response = await apiClient.get<SuccessResponse<Content>>(`protected/contents/${id}`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || '获取内容详情失败')
    } catch (error) {
      console.error('Get content error:', error)
      throw error
    }
  }

  // 更新内容
  async updateContent(id: number, updates: Partial<Content>): Promise<Content> {
    try {
      const response = await apiClient.put<SuccessResponse<Content>>(`protected/contents/${id}`, updates)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || '更新内容失败')
    } catch (error) {
      console.error('Update content error:', error)
      throw error
    }
  }

  // 删除内容
  async deleteContent(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<SuccessResponse>(`protected/contents/${id}`)
      
      if (!response.success) {
        throw new Error(response.message || '删除内容失败')
      }
    } catch (error) {
      console.error('Delete content error:', error)
      throw error
    }
  }

  // AI增强内容
  async enhanceWithAI(
    contentId: number, 
    aiProvider?: 'baidu' | 'alibaba' | 'tencent'
  ): Promise<Content> {
    try {
      const response = await apiClient.post<SuccessResponse<Content>>(
        `protected/contents/${contentId}/enhance`, 
        { ai_provider: aiProvider }
      )
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || 'AI增强失败')
    } catch (error) {
      console.error('AI enhance error:', error)
      throw error
    }
  }

  // 批量操作内容
  async batchUpdateContents(
    ids: number[], 
    updates: Partial<Content>
  ): Promise<void> {
    try {
      const response = await apiClient.put<SuccessResponse>('protected/contents/batch', {
        ids,
        updates
      })
      
      if (!response.success) {
        throw new Error(response.message || '批量更新失败')
      }
    } catch (error) {
      console.error('Batch update contents error:', error)
      throw error
    }
  }

  

  // 导出内容
  async exportContents(
    filters?: ContentFilters,
    format: 'json' | 'csv' | 'excel' = 'json'
  ): Promise<Blob> {
    try {
      const params: Record<string, string> = { format }
      
      // 添加过滤参数
      if (filters?.platform?.length) params.platform = filters.platform.join(',')
      if (filters?.parse_type?.length) params.parse_type = filters.parse_type.join(',')
      if (filters?.tags?.length) params.tags = filters.tags.join(',')
      if (filters?.date_from) params.date_from = filters.date_from
      if (filters?.date_to) params.date_to = filters.date_to
      if (filters?.search) params.search = filters.search
      if (filters?.group_id) params.group_id = filters.group_id.toString()
      
      const response = await fetch(
        apiClient['getApiUrl']('protected/contents/export') + '?' + new URLSearchParams(params),
        {
          headers: apiClient['getHeaders'](),
        }
      )
      
      if (!response.ok) {
        throw new Error('导出内容失败')
      }
      
      return await response.blob()
    } catch (error) {
      console.error('Export contents error:', error)
      throw error
    }
  }

  // 获取内容统计
  async getContentStats(groupId?: number): Promise<{
    total: number
    by_platform: Record<string, number>
    by_parse_type: Record<string, number>
    by_status: Record<string, number>
    recent_activity: Array<{
      date: string
      count: number
    }>
  }> {
    try {
      const params: Record<string, string> = {}
      if (groupId) params.group_id = groupId.toString()
      
      const response = await apiClient.get<SuccessResponse<any>>('protected/contents/stats', params)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || '获取统计数据失败')
    } catch (error) {
      console.error('Get content stats error:', error)
      throw error
    }
  }
}

// 创建内容服务实例
export const contentService = new ContentService()
