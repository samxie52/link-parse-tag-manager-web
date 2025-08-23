import { contentService } from './content-service'

// API服务统一导出
export { apiClient } from './api-client'
export { authService } from './auth-service'
export { contentService } from './content-service'
export { groupService } from './group-service'

// 导出所有类型
export * from './api-types'

// 示例：获取特定内容的函数
export async function getContentById(id: number) {
  return contentService.getContent(id)
}

// 示例：解析URL的函数
export async function parseUrl(url: string, groupId: number, useAI = false) {
  return contentService.parseUrl({
    url,
    group_id: groupId,
    use_ai: useAI
  })
}
