"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { EnhancedLoginForm } from "@/components/auth/enhanced-login-form"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 防止水合不匹配 - 等待客户端挂载和翻译准备完成
  if (!mounted || !ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="heading text-3xl text-foreground mb-2" suppressHydrationWarning>{t("appTitle")}</h1>
          <p className="body-text text-muted-foreground" suppressHydrationWarning>{t("appDescription")}</p>
        </div>
        <EnhancedLoginForm />
      </div>
    </div>
  )
}
