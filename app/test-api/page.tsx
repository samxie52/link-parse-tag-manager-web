'use client';

import { useState } from 'react';
import AuthGuard from '@/components/auth/auth-guard';
import apiClient from '@/lib/api-client';
import TokenManager from '@/lib/utils/token-manager';
import { authService } from '@/lib/api/auth-service';

export default function TestApiPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testProtectedApi = async () => {
    setLoading(true);
    try {
      // 测试受保护的API接口
      const response = await apiClient.get('/api/v1/protected/contents');
      setResult(`成功调用受保护API:\n${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`API调用失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testGetCurrentUser = async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      setResult(`获取当前用户成功:\n${JSON.stringify(user, null, 2)}`);
    } catch (error) {
      setResult(`获取用户信息失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const testTokenRefresh = async () => {
    setLoading(true);
    try {
      const newToken = await authService.refreshToken();
      setResult(`Token刷新成功:\n新token: ${newToken}`);
    } catch (error) {
      setResult(`Token刷新失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  const checkTokenStatus = () => {
    const tokenData = TokenManager.getTokenData();
    const isLoggedIn = TokenManager.isLoggedIn();
    const isExpiringSoon = TokenManager.isTokenExpiringSoon();
    const isExpired = TokenManager.isTokenExpired();
    
    setResult(`Token状态检查:
登录状态: ${isLoggedIn}
即将过期: ${isExpiringSoon}
已过期: ${isExpired}
Token数据: ${JSON.stringify(tokenData, null, 2)}`);
  };

  const clearTokens = () => {
    TokenManager.clearTokens();
    setResult('Token已清除');
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">API Token 测试页面</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">API 测试</h2>
            
            <button
              onClick={testProtectedApi}
              disabled={loading}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? '请求中...' : '测试受保护API'}
            </button>
            
            <button
              onClick={testGetCurrentUser}
              disabled={loading}
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? '请求中...' : '获取当前用户'}
            </button>
            
            <button
              onClick={testTokenRefresh}
              disabled={loading}
              className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
            >
              {loading ? '请求中...' : '刷新Token'}
            </button>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Token 管理</h2>
            
            <button
              onClick={checkTokenStatus}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              检查Token状态
            </button>
            
            <button
              onClick={clearTokens}
              className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              清除Token
            </button>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">测试结果:</h3>
          <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded border overflow-auto max-h-96">
            {result || '点击上方按钮进行测试...'}
          </pre>
        </div>
      </div>
    </AuthGuard>
  );
}
