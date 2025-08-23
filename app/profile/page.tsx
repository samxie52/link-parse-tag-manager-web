"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { Settings, Shield, Bell, Key } from "lucide-react"

export default function ProfilePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="heading text-3xl text-foreground">Profile Settings</h1>
            <p className="body-text text-muted-foreground mt-1">Manage your account settings and preferences</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="api" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                API Keys
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <ProfileForm user={user} />
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="heading">Security Settings</CardTitle>
                  <CardDescription className="body-text">Manage your password and security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Password</h4>
                      <p className="text-sm text-muted-foreground">Last updated 3 months ago</p>
                    </div>
                    <Button variant="outline">Change Password</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Badge variant="secondary">Not Enabled</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="heading">Notification Preferences</CardTitle>
                  <CardDescription className="body-text">Choose what notifications you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { title: "Email Notifications", description: "Receive updates via email" },
                      { title: "Push Notifications", description: "Get notified on your device" },
                      { title: "Team Invitations", description: "When someone invites you to a team" },
                      { title: "Content Updates", description: "When shared content is updated" },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                        <Badge variant="outline">Enabled</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="heading">API Keys</CardTitle>
                  <CardDescription className="body-text">Manage your API keys for integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <Key className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
                    <p className="text-muted-foreground mb-4">Create your first API key to start integrating</p>
                    <Button>Generate API Key</Button>
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
