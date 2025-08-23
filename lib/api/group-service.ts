// 组管理服务 - 替换原有的mock groups服务
import { apiClient } from './api-client'
import type { 
  Group, 
  GroupMember, 
  CreateGroupRequest, 
  InviteMembersRequest,
  PaginatedResponse,
  PaginationParams,
  SuccessResponse 
} from './api-types'

class GroupService {
  // 获取用户的组列表
  async getGroups(pagination?: PaginationParams): Promise<PaginatedResponse<Group>> {
    try {
      const params: Record<string, string> = {}
      
      if (pagination?.page) params.page = pagination.page.toString()
      if (pagination?.page_size) params.page_size = pagination.page_size.toString()
      if (pagination?.sort_by) params.sort_by = pagination.sort_by
      if (pagination?.sort_order) params.sort_order = pagination.sort_order
      
      const response = await apiClient.get<SuccessResponse<PaginatedResponse<Group>>>(
        'protected/groups', 
        params
      )
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || '获取组列表失败')
    } catch (error) {
      console.error('Get groups error:', error)
      throw error
    }
  }

  // 获取单个组详情
  async getGroup(id: number): Promise<Group> {
    try {
      const response = await apiClient.get<SuccessResponse<Group>>(`protected/groups/${id}`)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || '获取组详情失败')
    } catch (error) {
      console.error('Get group error:', error)
      throw error
    }
  }

  // 创建新组
  async createGroup(groupData: CreateGroupRequest): Promise<Group> {
    try {
      const response = await apiClient.post<SuccessResponse<Group>>('protected/groups', groupData)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || '创建组失败')
    } catch (error) {
      console.error('Create group error:', error)
      throw error
    }
  }

  // 更新组信息
  async updateGroup(id: number, updates: Partial<CreateGroupRequest>): Promise<Group> {
    try {
      const response = await apiClient.put<SuccessResponse<Group>>(`protected/groups/${id}`, updates)
      
      if (response.success && response.data) {
        return response.data
      }
      
      throw new Error(response.message || '更新组失败')
    } catch (error) {
      console.error('Update group error:', error)
      throw error
    }
  }

  // 删除组
  async deleteGroup(id: number): Promise<void> {
    try {
      const response = await apiClient.delete<SuccessResponse>(`protected/groups/${id}`)
      
      if (!response.success) {
        throw new Error(response.message || '删除组失败')
      }
    } catch (error) {
      console.error('Delete group error:', error)
      throw error
    }
  }

  // 邀请成员
  async inviteMembers(groupId: number, inviteData: InviteMembersRequest): Promise<void> {
    try {
      const response = await apiClient.post<SuccessResponse>(
        `protected/groups/${groupId}/invite`, 
        inviteData
      )
      
      if (!response.success) {
        throw new Error(response.message || '邀请成员失败')
      }
    } catch (error) {
      console.error('Invite members error:', error)
      throw error
    }
  }
}

// 创建组服务实例
export const groupService = new GroupService()
