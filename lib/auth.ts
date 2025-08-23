// Authentication utilities and types
import { authService, type User } from './api'

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

// 导出真实的认证服务，替换原有的mock服务
export { authService }
