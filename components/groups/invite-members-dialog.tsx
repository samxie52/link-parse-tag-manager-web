"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, Mail } from "lucide-react"
import { groupsService, type Group } from "@/lib/groups"

interface InviteMembersDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  group: Group | null
}

export function InviteMembersDialog({ open, onOpenChange, group }: InviteMembersDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [emails, setEmails] = useState<string[]>([])
  const [defaultRole, setDefaultRole] = useState<"member" | "viewer">("member")

  const addEmail = () => {
    const email = emailInput.trim()
    if (email && !emails.includes(email) && email.includes("@")) {
      setEmails((prev) => [...prev, email])
      setEmailInput("")
    }
  }

  const removeEmail = (emailToRemove: string) => {
    setEmails((prev) => prev.filter((email) => email !== emailToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!group || emails.length === 0) return

    setIsLoading(true)
    try {
      await groupsService.inviteMembers(group.id, emails)
      onOpenChange(false)
      setEmails([])
      setEmailInput("")
    } catch (error) {
      console.error("Failed to invite members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addEmail()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>Invite new members to join {group?.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Addresses</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="colleague@company.com"
                    className="pl-10"
                  />
                </div>
                <Button type="button" onClick={addEmail} disabled={!emailInput.trim()}>
                  Add
                </Button>
              </div>
            </div>

            {emails.length > 0 && (
              <div className="space-y-2">
                <Label>Invited Members ({emails.length})</Label>
                <div className="flex flex-wrap gap-2">
                  {emails.map((email) => (
                    <Badge key={email} variant="secondary" className="flex items-center gap-1">
                      {email}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeEmail(email)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Default Role</Label>
              <Select value={defaultRole} onValueChange={(value: "member" | "viewer") => setDefaultRole(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member - Can create and share content</SelectItem>
                  <SelectItem value="viewer">Viewer - Can view content only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || emails.length === 0}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invitations
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
