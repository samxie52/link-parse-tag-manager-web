'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TokenManager from '@/lib/utils/token-manager';
import { authService } from '@/lib/api/auth-service';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // 是否需要认证，默认true
  redirectTo?: string; // 未认证时跳转的页面，默认'/login'
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 检查是否有token
        if (!TokenManager.isLoggedIn()) {
          setIsAuthenticated(false);
          if (requireAuth) {
            router.push(redirectTo);
            return;
          }
        } else {
          // 验证token有效性
          try {
            await authService.getCurrentUser();
            setIsAuthenticated(true);
          } catch (error) {
            // token无效，清除并跳转
            TokenManager.clearTokens();
            setIsAuthenticated(false);
            if (requireAuth) {
              router.push(redirectTo);
              return;
            }
          }
        }
      } catch (error) {
        console.error('认证检查失败:', error);
        setIsAuthenticated(false);
        if (requireAuth) {
          router.push(redirectTo);
          return;
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [requireAuth, redirectTo, router]);

  // 如果不需要认证，直接渲染子组件
  if (!requireAuth) {
    return <>{children}</>;
  }

  // 加载中状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // 已认证，渲染子组件
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // 未认证且需要认证，显示空白（因为会跳转）
  return null;
}
