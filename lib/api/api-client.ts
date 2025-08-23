// API客户端配置和基础请求封装
interface ApiConfig {
  baseURL: string
  version: string
  timeout: number
  enableDebug: boolean
}

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: number
}

interface ApiError {
  message: string
  code?: number
  details?: any
}

class ApiClient {
  private config: ApiConfig
  private token: string | null = null

  constructor() {
    this.config = {
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
      version: process.env.NEXT_PUBLIC_API_VERSION || 'v1',
      timeout: 30000,
      enableDebug: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'
    }
    
    // 从localStorage加载token
    if (typeof window !== 'undefined') {
      const storageKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || 'auth-token'
      this.token = localStorage.getItem(storageKey)
    }
  }

  // 设置认证token
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      const storageKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || 'auth-token'
      localStorage.setItem(storageKey, token)
    }
  }

  // 清除认证token
  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      const storageKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || 'auth-token'
      localStorage.removeItem(storageKey)
    }
  }

  // 获取完整的API URL
  private getApiUrl(endpoint: string): string {
    const baseUrl = this.config.baseURL.replace(/\/$/, '')
    const version = this.config.version
    const cleanEndpoint = endpoint.replace(/^\//, '')
    return `${baseUrl}/api/${version}/${cleanEndpoint}`
  }

  // 构建请求headers
  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    return headers
  }

  // 处理API响应
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    
    let data: any
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    if (this.config.enableDebug) {
      console.log('API Response:', {
        status: response.status,
        url: response.url,
        data
      })
    }

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || data.error || `HTTP ${response.status}`,
        code: response.status,
        details: data
      }
      throw error
    }

    return data
  }

  // 基础请求方法
  private async request<T>(
    method: string,
    endpoint: string,
    options: {
      body?: any
      headers?: Record<string, string>
      params?: Record<string, string>
    } = {}
  ): Promise<T> {
    const url = this.getApiUrl(endpoint)
    const { body, headers = {}, params } = options

    // 添加查询参数
    const finalUrl = new URL(url)
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        finalUrl.searchParams.append(key, value)
      })
    }

    const requestOptions: RequestInit = {
      method,
      headers: this.getHeaders(headers),
      signal: AbortSignal.timeout(this.config.timeout)
    }

    if (body && method !== 'GET') {
      requestOptions.body = JSON.stringify(body)
    }

    if (this.config.enableDebug) {
      console.log('API Request:', {
        method,
        url: finalUrl.toString(),
        headers: requestOptions.headers,
        body: requestOptions.body
      })
    }

    try {
      const response = await fetch(finalUrl.toString(), requestOptions)
      return await this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求超时')
      }
      throw error
    }
  }

  // GET请求
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>('GET', endpoint, { params })
  }

  // POST请求
  async post<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>('POST', endpoint, { body })
  }

  // PUT请求
  async put<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>('PUT', endpoint, { body })
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint)
  }

  // PATCH请求
  async patch<T>(endpoint: string, body?: any): Promise<T> {
    return this.request<T>('PATCH', endpoint, { body })
  }
}

// 创建全局API客户端实例
export const apiClient = new ApiClient()

// 导出类型
export type { ApiResponse, ApiError, ApiConfig }
