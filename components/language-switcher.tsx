"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages, Loader2 } from "lucide-react"

export function LanguageSwitcher() {
  const { i18n, t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  // 防止水合不匹配 - 等待客户端挂载和翻译准备完成
  if (!mounted || !ready) {
    return (
      <Button variant="ghost" size="sm" className="gap-2" disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2" suppressHydrationWarning>
          <Languages className="h-4 w-4" />
          {t("language")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLanguage("en")}>{t("english")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage("zh")}>{t("chinese")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
