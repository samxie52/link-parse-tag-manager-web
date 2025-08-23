"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { UserMenu } from "./user-menu"
import { LanguageSwitcher } from "@/components/language-switcher"
import { LayoutDashboard, Share2, Users, User, CreditCard, Menu, X, Loader2 } from "lucide-react"

const navigation = [
  { nameKey: "dashboard", href: "/", icon: LayoutDashboard },
  { nameKey: "share", href: "/share", icon: Share2 },
  { nameKey: "groups", href: "/groups", icon: Users },
  { nameKey: "profile", href: "/profile", icon: User },
  { nameKey: "subscription", href: "/subscription", icon: CreditCard },
]

export function Sidebar() {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  // 防止水合不匹配 - 等待客户端挂载和翻译准备完成
  if (!mounted || !ready) {
    return (
      <div className="fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border">
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-sidebar-border">
            <h1 className="heading text-xl text-sidebar-foreground" suppressHydrationWarning>{t("appTitle")}</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.nameKey}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  <span suppressHydrationWarning>{t(item.nameKey)}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Menu and Language Switcher */}
          <div className="p-4 border-t border-sidebar-border flex justify-between">
            <div className="flex items-center justify-center">
              <UserMenu />
            </div>
            <div className="flex items-center justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}
