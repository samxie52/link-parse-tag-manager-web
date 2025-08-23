"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GroupCard } from "@/components/groups/group-card"
import { CreateGroupDialog } from "@/components/groups/create-group-dialog"
import { InviteMembersDialog } from "@/components/groups/invite-members-dialog"
import { GroupManagementDialog } from "@/components/groups/group-management-dialog"
import { Plus, Search, Users } from "lucide-react"
import { groupsService, type Group } from "@/lib/groups"

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [manageDialogOpen, setManageDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  useEffect(() => {
    groupsService
      .getGroups()
      .then(setGroups)
      .finally(() => setIsLoading(false))
  }, [])

  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "owned" && group.owner.id === "1") ||
      (activeTab === "member" && group.owner.id !== "1")

    return matchesSearch && matchesTab
  })

  const handleCreateGroup = (group: Group) => {
    setGroups((prev) => [group, ...prev])
  }

  const handleManageGroup = (group: Group) => {
    setSelectedGroup(group)
    setManageDialogOpen(true)
  }

  const handleInviteMembers = (group: Group) => {
    setSelectedGroup(group)
    setInviteDialogOpen(true)
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading groups...</p>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading text-3xl text-foreground">Groups & Teams</h1>
              <p className="body-text text-muted-foreground mt-1">
                Collaborate with your team and manage shared content
              </p>
            </div>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Group
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                All Groups ({groups.length})
              </TabsTrigger>
              <TabsTrigger value="owned">Owned ({groups.filter((g) => g.owner.id === "1").length})</TabsTrigger>
              <TabsTrigger value="member">Member ({groups.filter((g) => g.owner.id !== "1").length})</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-6">
              {filteredGroups.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No groups found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery ? "Try adjusting your search terms" : "Create your first group to get started"}
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Group
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      group={group}
                      onManage={handleManageGroup}
                      onInvite={handleInviteMembers}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialogs */}
        <CreateGroupDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onCreated={handleCreateGroup} />

        <InviteMembersDialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen} group={selectedGroup} />

        <GroupManagementDialog open={manageDialogOpen} onOpenChange={setManageDialogOpen} group={selectedGroup} />
      </MainLayout>
    </ProtectedRoute>
  )
}
