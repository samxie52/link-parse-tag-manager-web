interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  expires_at: number; // 计算出的过期时间戳
}

class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly TOKEN_DATA_KEY = 'token_data';

  /**
   * 保存登录后的token数据
   */
  static saveTokens(tokenData: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  }): void {
    const now = Date.now();
    const expiresAt = now + (tokenData.expires_in * 1000);
    
    const fullTokenData: TokenData = {
      ...tokenData,
      expires_at: expiresAt
    };

    // 保存到localStorage
    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokenData.access_token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokenData.refresh_token);
    localStorage.setItem(this.TOKEN_DATA_KEY, JSON.stringify(fullTokenData));
  }

  /**
   * 获取访问token
   */
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * 获取刷新token
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * 获取完整token数据
   */
  static getTokenData(): TokenData | null {
    const data = localStorage.getItem(this.TOKEN_DATA_KEY);
    if (!data) return null;
    
    try {
      return JSON.parse(data) as TokenData;
    } catch {
      return null;
    }
  }

  /**
   * 检查token是否即将过期（提前5分钟刷新）
   */
  static isTokenExpiringSoon(): boolean {
    const tokenData = this.getTokenData();
    if (!tokenData) return true;

    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5分钟
    return (tokenData.expires_at - now) < fiveMinutes;
  }

  /**
   * 检查token是否已过期
   */
  static isTokenExpired(): boolean {
    const tokenData = this.getTokenData();
    if (!tokenData) return true;

    return Date.now() >= tokenData.expires_at;
  }

  /**
   * 清除所有token
   */
  static clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_DATA_KEY);
  }

  /**
   * 检查是否已登录
   */
  static isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired();
  }

  /**
   * 获取Authorization头部值
   */
  static getAuthorizationHeader(): string | null {
    const token = this.getAccessToken();
    if (!token) return null;
    
    const tokenData = this.getTokenData();
    const tokenType = tokenData?.token_type || 'Bearer';
    
    return `${tokenType} ${token}`;
  }
}

export default TokenManager;
