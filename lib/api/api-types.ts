// API数据类型定义，与后端API结构对应

// 用户相关类型
export interface User {
  id: number
  username: string
  email: string
  phone?: string
  avatar?: string
  openid?: string
  unionid?: string
  role: "admin" | "member" | "viewer"
  status: "active" | "inactive" | "banned"
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email?: string
  username?: string
  phone?: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  user: User
}

// 刷新token响应类型
export interface RefreshTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

// 内容相关类型
export interface Content {
  id: number
  url: string
  title: string
  description: string
  content?: string
  platform: "xiaohongshu" | "gaode" | "meituan" | "wechat" | "douyin"
  parse_type: "basic" | "ai_enhanced"
  tags: string[]
  images: string[]
  metadata: Record<string, any>
  confidence: number
  group_id: number
  user_id: number
  status: "draft" | "published" | "archived"
  created_at: string
  updated_at: string
}

export interface ParseRequest {
  url: string
  group_id: number
  force_ai?: boolean
  ai_provider?: "baidu" | "alibaba" | "tencent"
}

// 更新的解析响应结构
export interface ParseResponse {
  success: boolean
  data: {
    parse_result: ParseResultData
    quota_info?: QuotaInfo
  }
  error?: {
    code: string
    message: string
  }
}

export interface ParseResultData {
  parse_type: "basic" | "ai_enhanced"
  platform: string
  basic: BasicParseResult
  platform_metadata?: Record<string, any>
  ai_metadata?: Record<string, any>
}

export interface BasicParseResult {
  title: string
  description: string
  tags: string[]
  thumbnail?: string
  images?: string[]
  videos?: string[]
  author?: string
  published_at?: string
  confidence: number
  parsed_at: string
  parse_time_ms: number
}

export interface QuotaInfo {
  ai_quota_used: number
  ai_quota_limit: number
  ai_quota_remaining: number
}

// 平台特定元数据类型
export interface XHSPlatformMetadata {
  note_id: string
  author: string
  author_id: string
  like_count: string
  share_count: string
  comment_count: string
  collect_count: string
  view_count: string
  published_at?: string
  note_type: string
  share_code: string
  tags: string[]
  images: string[]
  videos: string[]
  video_duration: string
}

export interface AMAPPlatformMetadata {
  poi_id: string
  place_name: string
  address: string
  latitude: number
  longitude: number
  coord_x: number
  coord_y: number
  telephone: string
  province: string
  city: string
  district: string
  adcode: string
  poi_type: string
  rating: string
  open_time: string
  share_type: string
  user_token: string
  typecode: string
  gridcode: string
  citycode: string
  pcode: string
  biz_type: string
  tag: string
  entr_location: string
  exit_location: string
  timestamp: string
  recommend: string
  discount_num: string
  groupbuy_num: string
  shopinfo: string
  indoor_map: string
  meal_ordering: string
  opentime2: string
  cost: string
}

// 组相关类型
export interface Group {
  id: number
  name: string
  description: string
  avatar?: string
  owner_id: number
  member_count: number
  content_count: number
  is_private: boolean
  settings: {
    allow_member_invites: boolean
    require_approval: boolean
    default_role: "member" | "viewer"
  }
  created_at: string
  updated_at: string
}

export interface GroupMember {
  id: number
  group_id: number
  user_id: number
  role: "owner" | "admin" | "member" | "viewer"
  status: "active" | "invited" | "inactive"
  joined_at: string
  user: User
}

export interface CreateGroupRequest {
  name: string
  description: string
  is_private?: boolean
  settings?: {
    allow_member_invites?: boolean
    require_approval?: boolean
    default_role?: "member" | "viewer"
  }
}

export interface InviteMembersRequest {
  emails: string[]
  role?: "member" | "viewer"
  message?: string
}

// 订阅相关类型
export interface Subscription {
  id: number
  user_id: number
  plan_type: "free" | "basic" | "premium"
  status: "active" | "inactive" | "cancelled" | "expired"
  start_date: string
  end_date: string
  auto_renew: boolean
  created_at: string
  updated_at: string
}

export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  billing_cycle: "monthly" | "yearly"
  features: {
    max_groups: number
    max_members_per_group: number
    max_contents_per_group: number
    supported_platforms: string[]
    ai_quota: number
    ai_features: boolean
  }
}

// AI相关类型
export interface AIProvider {
  id: number
  name: string
  provider_type: "baidu" | "alibaba" | "tencent"
  api_key: string
  api_secret?: string
  endpoint: string
  model_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface AIParseLog {
  id: number
  user_id: number
  content_id: number
  ai_provider: string
  prompt: string
  response: string
  tokens_used: number
  cost: number
  status: "success" | "failed" | "timeout"
  error_message?: string
  created_at: string
}

// 分页相关类型
export interface PaginationParams {
  page?: number
  page_size?: number
  sort_by?: string
  sort_order?: "asc" | "desc"
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

// 过滤相关类型
export interface ContentFilters {
  platform?: string[]
  parse_type?: string[]
  tags?: string[]
  date_from?: string
  date_to?: string
  search?: string
  group_id?: number
}

// 统计相关类型
export interface DashboardStats {
  total_contents: number
  ai_enhanced_contents: number
  total_groups: number
  active_members: number
  today_activities: number
  monthly_growth: {
    contents: number
    ai_enhanced: number
    members: number
  }
}

// 错误响应类型
export interface ErrorResponse {
  error: string
  message: string
  code?: number
  details?: Record<string, any>
}

// 成功响应类型
export interface SuccessResponse<T = any> {
  success: boolean
  data?: T
  message?: string
}
