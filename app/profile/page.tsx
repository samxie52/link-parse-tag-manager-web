"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { Settings, Shield, Bell, Key, Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    setMounted(true)
  }, [])

  // 防止水合不匹配 - 等待客户端挂载和翻译准备完成
  if (!mounted || !ready) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="heading text-3xl text-foreground" suppressHydrationWarning>{t("profileSettings")}</h1>
            <p className="body-text text-muted-foreground mt-1" suppressHydrationWarning>{t("profileDescription")}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span suppressHydrationWarning>{t("profile")}</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span suppressHydrationWarning>{t("security")}</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span suppressHydrationWarning>{t("notifications")}</span>
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span suppressHydrationWarning>{t("apiKeys")}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileForm user={user} />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="heading" suppressHydrationWarning>{t("securitySettings")}</CardTitle>
                  <CardDescription className="body-text" suppressHydrationWarning>{t("securityDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium" suppressHydrationWarning>{t("password")}</h4>
                      <p className="text-sm text-muted-foreground" suppressHydrationWarning>{t("lastUpdated")}</p>
                    </div>
                    <Button variant="outline">
                      <span suppressHydrationWarning>{t("changePassword")}</span>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium" suppressHydrationWarning>{t("twoFactorAuth")}</h4>
                      <p className="text-sm text-muted-foreground" suppressHydrationWarning>{t("extraSecurity")}</p>
                    </div>
                    <Badge variant="secondary" suppressHydrationWarning>{t("notEnabled")}</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="heading" suppressHydrationWarning>{t("notificationPreferences")}</CardTitle>
                  <CardDescription className="body-text" suppressHydrationWarning>{t("notificationDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { titleKey: "emailNotifications", descriptionKey: "emailNotificationsDesc" },
                      { titleKey: "pushNotifications", descriptionKey: "pushNotificationsDesc" },
                      { titleKey: "teamInvitations", descriptionKey: "teamInvitationsDesc" },
                      { titleKey: "contentUpdates", descriptionKey: "contentUpdatesDesc" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium" suppressHydrationWarning>{t(item.titleKey)}</h4>
                          <p className="text-sm text-muted-foreground" suppressHydrationWarning>{t(item.descriptionKey)}</p>
                        </div>
                        <Badge variant="outline" suppressHydrationWarning>{t("enabled")}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="heading" suppressHydrationWarning>{t("apiKeys")}</CardTitle>
                  <CardDescription className="body-text" suppressHydrationWarning>{t("apiKeysDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <Key className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2" suppressHydrationWarning>{t("noApiKeys")}</h3>
                    <p className="text-muted-foreground mb-4" suppressHydrationWarning>{t("createFirstApiKey")}</p>
                    <Button>
                      <span suppressHydrationWarning>{t("generateApiKey")}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
