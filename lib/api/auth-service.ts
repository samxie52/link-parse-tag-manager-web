// 认证服务 - 替换原有的mock auth服务
import apiClient from '../api-client';
import TokenManager from '../utils/token-manager';
import type { User, LoginRequest, LoginResponse, SuccessResponse, RefreshTokenResponse } from './api-types'

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

class AuthService {
  /**
   * 用户注册
   */
  async register(data: {
    platformType: string
    registerType: string
    username: string
    email: string
    password: string
    phone?: string
  }): Promise<User> {
    const response = await apiClient.post<LoginResponse>('/api/v1/auth/register', {
      ...data,
      platform_type: data.platformType || 'web',
      register_type: data.registerType || 'email'
    });

    if (response.success && response.data) {
      // 保存token到本地存储
      TokenManager.saveTokens({
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type
      });
      
      return response.data.user;
    }

    throw new Error(response.error?.message || '注册失败');
  }

  /**
   * 用户登录
   */
  async login(credentials: LoginRequest | { email: string; password: string }): Promise<User> {
    try {
      // 如果传入的是简单的 email/password 对象，转换为 LoginRequest 格式
      let loginData: LoginRequest;
      if ('email' in credentials && 'password' in credentials && Object.keys(credentials).length === 2) {
        loginData = {
          email: credentials.email,
          password: credentials.password
        };
      } else {
        loginData = credentials as LoginRequest;
      }

      const response = await apiClient.post<LoginResponse>('/api/v1/auth/login', {
        email: loginData.email,
        password: loginData.password,
        platform_type: 'web',
        login_type: 'email'
      });

      if (response.success && response.data) {
        // 保存token到本地存储
        TokenManager.saveTokens({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires_in: response.data.expires_in,
          token_type: response.data.token_type
        });
        
        return response.data.user;
      }

      throw new Error(response.error?.message || '登录失败');
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  /**
   * 用户登出
   */
  async logout(): Promise<void> {
    try {
      // 调用后端登出接口
      await apiClient.post('/api/v1/auth/logout');
    } catch (error) {
      // 即使后端登出失败，也要清除本地token
      console.warn('后端登出失败，但继续清除本地token:', error);
    } finally {
      // 清除本地存储的token
      TokenManager.clearTokens();
    }
  }

  /**
   * 刷新token
   */
  async refreshToken(): Promise<string | null> {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('没有刷新token');
    }

    const response = await apiClient.post<RefreshTokenResponse>('/api/v1/auth/refresh', {
      refresh_token: refreshToken
    });

    if (response.success && response.data) {
      // 更新本地存储的token
      TokenManager.saveTokens({
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
        token_type: response.data.token_type
      });
      
      return response.data.access_token;
    }

    throw new Error(response.error?.message || 'Token刷新失败');
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<User>('/api/v1/auth/me');
      
      if (response.success && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Get current user error:', error)
      // 如果获取用户信息失败，清除token
      TokenManager.clearTokens();
      return null;
    }
  }

  /**
   * 发送验证码
   */
  async sendVerificationCode(phone: string): Promise<void> {
    try {
      const response = await apiClient.post<SuccessResponse>('/api/v1/auth/send-code', { phone });
      
      if (!response.success) {
        throw new Error(response.error?.message || '发送验证码失败');
      }
    } catch (error) {
      console.error('Send verification code error:', error)
      throw error
    }
  }

  /**
   * 手机号登录
   */
  async phoneLogin(phone: string, code: string): Promise<User> {
    try {
      const response = await apiClient.post<LoginResponse>('/api/v1/auth/phone/login', {
        phone,
        verification_code: code
      });
      
      if (response.success && response.data) {
        // 保存token到本地存储
        TokenManager.saveTokens({
          access_token: response.data.access_token,
          refresh_token: response.data.refresh_token,
          expires_in: response.data.expires_in,
          token_type: response.data.token_type
        });
        
        return response.data.user;
      }
      
      throw new Error(response.error?.message || '手机号登录失败');
    } catch (error) {
      console.error('Phone login error:', error)
      throw error
    }
  }

  /**
   * 重置密码
   */
  async resetPassword(email: string): Promise<void> {
    try {
      const response = await apiClient.post<SuccessResponse>('/api/v1/auth/reset-password', { email });
      
      if (!response.success) {
        throw new Error(response.error?.message || '重置密码失败');
      }
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  }

  /**
   * 更新密码
   */
  async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      const response = await apiClient.put<SuccessResponse>('/api/v1/auth/password', {
        old_password: oldPassword,
        new_password: newPassword
      });
      
      if (!response.success) {
        throw new Error(response.error?.message || '更新密码失败');
      }
    } catch (error) {
      console.error('Update password error:', error)
      throw error
    }
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn(): boolean {
    return TokenManager.isLoggedIn();
  }

  /**
   * 获取当前用户的访问token
   */
  getAccessToken(): string | null {
    return TokenManager.getAccessToken();
  }

  /**
   * 检查token是否即将过期
   */
  isTokenExpiringSoon(): boolean {
    return TokenManager.isTokenExpiringSoon();
  }
}

// 创建认证服务实例
export const authService = new AuthService()
