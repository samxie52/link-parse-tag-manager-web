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
import { Loader2 } from "lucide-react"
import { groupsService, type Group } from "@/lib/groups"

interface CreateGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (group: Group) => void
}

export function CreateGroupDialog({ open, onOpenChange, onCreated }: CreateGroupDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPrivate: false,
    allowMemberInvites: true,
    requireApproval: false,
    defaultRole: "member" as "member" | "viewer",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const group = await groupsService.createGroup({
        name: formData.name,
        description: formData.description,
        isPrivate: formData.isPrivate,
        settings: {
          allowMemberInvites: formData.allowMemberInvites,
          requireApproval: formData.requireApproval,
          defaultRole: formData.defaultRole,
        },
      })

      onCreated(group)
      onOpenChange(false)
      setFormData({
        name: "",
        description: "",
        isPrivate: false,
        allowMemberInvites: true,
        requireApproval: false,
        defaultRole: "member",
      })
    } catch (error) {
      console.error("Failed to create group:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>Set up a new group for team collaboration and content sharing.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Marketing Team"
                required
              />
            </div>

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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Private Group</Label>
                  <p className="text-sm text-muted-foreground">Only invited members can join</p>
                </div>
                <Switch
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPrivate: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Member Invites</Label>
                  <p className="text-sm text-muted-foreground">Members can invite others</p>
                </div>
                <Switch
                  checked={formData.allowMemberInvites}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, allowMemberInvites: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Approval</Label>
                  <p className="text-sm text-muted-foreground">New members need approval</p>
                </div>
                <Switch
                  checked={formData.requireApproval}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, requireApproval: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Default Role</Label>
                <Select
                  value={formData.defaultRole}
                  onValueChange={(value: "member" | "viewer") =>
                    setFormData((prev) => ({ ...prev, defaultRole: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
