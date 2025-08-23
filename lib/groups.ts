// Groups and team management types and utilities
import { groupService, type Group, type GroupMember } from './api'

export interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  role: "owner" | "admin" | "member" | "viewer"
  joinedAt: string
  lastActive: string
  status: "active" | "invited" | "inactive"
}

export interface Group {
  id: string
  name: string
  description: string
  avatar?: string
  createdAt: string
  updatedAt: string
  memberCount: number
  contentCount: number
  isPrivate: boolean
  members: TeamMember[]
  owner: TeamMember
  settings: {
    allowMemberInvites: boolean
    requireApproval: boolean
    defaultRole: "member" | "viewer"
  }
}

export interface GroupActivity {
  id: string
  groupId: string
  userId: string
  userName: string
  userAvatar?: string
  action: "joined" | "left" | "shared_content" | "created_group" | "updated_settings"
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

// 转换API响应到前端格式的辅助函数
function convertApiGroupToFrontend(apiGroup: Group): Group & {
  members: TeamMember[]
  owner: TeamMember
} {
  return {
    ...apiGroup,
    members: [], // 需要单独调用API获取成员列表
    owner: {
      id: apiGroup.owner_id.toString(),
      name: "Owner", // 需要从用户信息获取
      email: "",
      role: "owner",
      joinedAt: apiGroup.created_at,
      lastActive: new Date().toISOString(),
      status: "active"
    }
  }
}

// 真实的组管理服务，替换原有的mock服务
export const groupsService = {
  async getGroups(): Promise<Group[]> {
    try {
      const response = await groupService.getGroups({ page: 1, page_size: 50 })
      return response.data
    } catch (error) {
      console.error('Get groups error:', error)
      throw error
    }
  },

  async createGroup(data: Partial<Group>): Promise<Group> {
    try {
      const groupData = {
        name: data.name || "New Group",
        description: data.description || "",
        is_private: data.is_private || false,
        settings: data.settings
      }
      
      return await groupService.createGroup(groupData)
    } catch (error) {
      console.error('Create group error:', error)
      throw error
    }
  },

  async inviteMembers(groupId: string, emails: string[]): Promise<void> {
    try {
      await groupService.inviteMembers(parseInt(groupId), { emails })
    } catch (error) {
      console.error('Invite members error:', error)
      throw error
    }
  },

  async getGroupActivity(groupId: string): Promise<GroupActivity[]> {
    try {
      const response = await groupService.getGroupActivity(parseInt(groupId), { page: 1, page_size: 20 })
      
      return response.data.map(activity => ({
        id: activity.id.toString(),
        groupId: activity.group_id.toString(),
        userId: activity.user_id.toString(),
        userName: activity.user_name,
        userAvatar: activity.user_avatar,
        action: activity.action as any,
        description: activity.description,
        timestamp: activity.created_at,
        metadata: activity.metadata
      }))
    } catch (error) {
      console.error('Get group activity error:', error)
      throw error
    }
  },
}
