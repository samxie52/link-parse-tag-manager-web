"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload } from "lucide-react"
import { groupsService, type Group } from "@/lib/groups"

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (group: Group) => void
}

interface CreateGroupFormData {
  name: string
  description: string
  avatar_url: string
  is_private: boolean
  member_limit: number
  allow_member_invites: boolean
}

export function CreateGroupDialog({ open, onOpenChange, onCreated }: CreateGroupDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateGroupFormData>({
    name: "",
    description: "",
    avatar_url: "",
    is_private: false,
    member_limit: 5,
    allow_member_invites: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const group = await groupsService.createGroup({
        name: formData.name,
        description: formData.description || undefined,
        avatar_url: formData.avatar_url || undefined,
        is_private: formData.is_private,
        member_limit: formData.member_limit,
        allow_member_invites: formData.allow_member_invites,
      })

      onCreated(group)
      onOpenChange(false)
      setFormData({
        name: "",
        description: "",
        avatar_url: "",
        is_private: false,
        member_limit: 5,
        allow_member_invites: true,
      })
    } catch (error) {
      console.error("Failed to create group:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const memberLimitOptions = [
    { value: 5, label: "5 members" },
    { value: 10, label: "10 members" },
    { value: 25, label: "25 members" },
    { value: 50, label: "50 members" },
    { value: 100, label: "100 members" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>Set up a new group for team collaboration and content sharing.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Group Name - Required */}
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Marketing Team"
                maxLength={100}
                required
              />
            </div>

            {/* Description - Optional */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the group's purpose"
                rows={3}
              />
            </div>

            {/* Avatar URL - Optional */}
            <div className="space-y-2">
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="avatar_url"
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, avatar_url: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                  maxLength={500}
                />
                <Button type="button" variant="outline" size="icon" title="Upload Avatar">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {formData.avatar_url && (
                <div className="mt-2">
                  <img
                    src={formData.avatar_url}
                    alt="Avatar preview"
                    className="w-12 h-12 rounded-full object-cover border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Member Limit */}
            <div className="space-y-2">
              <Label>Member Limit</Label>
              <Select
                value={formData.member_limit.toString()}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, member_limit: parseInt(value) }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {memberLimitOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {/* Private Group */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Private Group</Label>
                  <p className="text-sm text-muted-foreground">Only invited members can join</p>
                </div>
                <Switch
                  checked={formData.is_private}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_private: checked }))}
                />
              </div>

              {/* Allow Member Invites */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Member Invites</Label>
                  <p className="text-sm text-muted-foreground">Members can invite others to join</p>
                </div>
                <Switch
                  checked={formData.allow_member_invites}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allow_member_invites: checked }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
