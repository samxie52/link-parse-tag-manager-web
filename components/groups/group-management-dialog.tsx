"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal, Crown, Shield, User, Eye, Clock } from "lucide-react"
import { groupsService, type Group, type GroupActivity } from "@/lib/groups"

interface GroupManagementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: Group | null
}

export function GroupManagementDialog({ open, onOpenChange, group }: GroupManagementDialogProps) {
  const [activity, setActivity] = useState<GroupActivity[]>([])
  const [isLoadingActivity, setIsLoadingActivity] = useState(false)

  useEffect(() => {
    if (open && group) {
      setIsLoadingActivity(true)
      groupsService
        .getGroupActivity(group.id)
        .then(setActivity)
        .finally(() => setIsLoadingActivity(false))
    }
  }, [open, group])

  if (!group) return null

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "admin":
        return <Shield className="h-4 w-4 text-blue-500" />
      case "member":
        return <User className="h-4 w-4 text-green-500" />
      case "viewer":
        return <Eye className="h-4 w-4 text-gray-500" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "joined":
        return <User className="h-4 w-4 text-green-500" />
      case "shared_content":
        return <Eye className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={group.avatar || "/placeholder.svg"} alt={group.name} />
              <AvatarFallback>
                {group.name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {group.name}
          </DialogTitle>
          <DialogDescription>{group.description}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="members" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">Members ({group.memberCount})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {/* Owner */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={group.owner.avatar || "/placeholder.svg"} alt={group.owner.name} />
                          <AvatarFallback>
                            {group.owner.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{group.owner.name}</p>
                          <p className="text-sm text-muted-foreground">{group.owner.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getRoleIcon(group.owner.role)}
                          Owner
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Members */}
                {group.members.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <p className="text-xs text-muted-foreground">
                              Last active: {new Date(member.lastActive).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="flex items-center gap-1 capitalize">
                            {getRoleIcon(member.role)}
                            {member.role}
                          </Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Change Role</DropdownMenuItem>
                              <DropdownMenuItem>Remove Member</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <ScrollArea className="h-[400px]">
              {isLoadingActivity ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">Loading activity...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activity.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={item.userAvatar || "/placeholder.svg"} alt={item.userName} />
                            <AvatarFallback>
                              {item.userName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {getActivityIcon(item.action)}
                              <p className="text-sm">
                                <span className="font-medium">{item.userName}</span> {item.description}
                              </p>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Group Settings</CardTitle>
                <CardDescription>Manage group permissions and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="group-name">Group Name</Label>
                  <Input id="group-name" defaultValue={group.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="group-description">Description</Label>
                  <Input id="group-description" defaultValue={group.description} />
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
