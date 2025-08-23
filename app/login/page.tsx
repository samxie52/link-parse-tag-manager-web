"use client"

import { useTranslation } from "react-i18next"
import { EnhancedLoginForm } from "@/components/auth/enhanced-login-form"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function LoginPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="heading text-3xl text-foreground mb-2">{t("appTitle")}</h1>
          <p className="body-text text-muted-foreground">{t("appDescription")}</p>
        </div>
        <EnhancedLoginForm />
      </div>
    </div>
  )
}
