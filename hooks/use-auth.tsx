"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { authService, type User, type AuthState } from "@/lib/auth"

const AuthContext = createContext<
  AuthState & {
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
  }
>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 只有在有token的情况下才检查用户状态
    const checkAuthState = async () => {
      try {
        // 先检查本地是否有token
        if (!authService.isLoggedIn()) {
          setUser(null)
          setIsLoading(false)
          return
        }

        // 有token时才调用getCurrentUser
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        // 静默处理错误，避免在控制台显示401错误
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthState()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const user = await authService.login({ email, password })
      // authService.login已经自动保存了token，不需要手动设置mock token
      setUser(user)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
