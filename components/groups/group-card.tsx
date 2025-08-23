"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Users, FileText, MoreHorizontal, Settings, UserPlus, Eye, Lock } from "lucide-react"
import type { Group } from "@/lib/groups"

interface GroupCardProps {
  group: Group
  onManage: (group: Group) => void
  onInvite: (group: Group) => void
}

export function GroupCard({ group, onManage, onInvite }: GroupCardProps) {
  const initials = group.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={group.avatar || "/placeholder.svg"} alt={group.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                {group.name}
                {group.isPrivate && <Lock className="h-4 w-4 text-muted-foreground" />}
              </CardTitle>
              <CardDescription>{group.description}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onManage(group)}>
                <Settings className="mr-2 h-4 w-4" />
                Manage Group
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onInvite(group)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Members
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Activity
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{group.memberCount} members</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>{group.contentCount} content</span>
            </div>
          </div>

          {/* Members Preview */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Recent Members</p>
            <div className="flex items-center gap-2">
              {group.members.slice(0, 4).map((member) => (
                <Avatar key={member.id} className="h-8 w-8">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {group.memberCount > 4 && (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                  +{group.memberCount - 4}
                </div>
              )}
            </div>
          </div>

          {/* Owner */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Avatar className="h-6 w-6">
                <AvatarImage src={group.owner.avatar || "/placeholder.svg"} alt={group.owner.name} />
                <AvatarFallback>
                  {group.owner.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-muted-foreground">Owner: {group.owner.name}</span>
            </div>
            <Badge variant="outline" className="capitalize">
              {group.owner.role}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
