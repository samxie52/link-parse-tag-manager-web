"use client"

import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
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
