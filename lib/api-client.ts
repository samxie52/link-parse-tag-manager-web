import TokenManager from './utils/token-manager';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  timestamp: string;
  request_id: string;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (error?: any) => void;
  }> = [];

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080', timeout: number = 10000) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  /**
   * 处理token刷新队列
   */
  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  /**
   * 刷新token
   */
  private async refreshToken(): Promise<string | null> {
    if (this.isRefreshing) {
      // 如果正在刷新，将请求加入队列
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      });
    }

    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) {
      this.processQueue(new Error('No refresh token'), null);
      return null;
    }

    this.isRefreshing = true;

    try {
      const response = await this.request<{
        access_token: string;
        refresh_token: string;
        expires_in: number;
        token_type: string;
      }>('/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      }, false); // 不自动重试，避免无限循环

      if (response.success && response.data) {
        TokenManager.saveTokens(response.data);
        this.processQueue(null, response.data.access_token);
        return response.data.access_token;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      this.processQueue(error, null);
      TokenManager.clearTokens();
      // 可以在这里触发重新登录
      window.location.href = '/login';
      return null;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * 核心请求方法
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    autoRetry: boolean = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    // 准备请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    // 检查是否需要添加Authorization头部
    const isAuthEndpoint = endpoint.startsWith('/api/v1/auth/') && 
      !endpoint.includes('/protected/');
    
    if (!isAuthEndpoint) {
      // 检查token是否即将过期，提前刷新
      if (TokenManager.isTokenExpiringSoon() && autoRetry) {
        await this.refreshToken();
      }

      const authHeader = TokenManager.getAuthorizationHeader();
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }
    }

    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // 处理401未授权错误
      if (response.status === 401 && !isAuthEndpoint && autoRetry) {
        const newToken = await this.refreshToken();
        if (newToken) {
          // 重新发起请求
          return this.request<T>(endpoint, options, false);
        }
      }

      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('请求超时');
        }
        throw error;
      }
      
      throw new Error('网络请求失败');
    }
  }

  // GET请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return this.request<T>(url, { method: 'GET' });
  }

  // POST请求
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT请求
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // PATCH请求
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// 创建全局实例
const apiClient = new ApiClient();

export default apiClient;
