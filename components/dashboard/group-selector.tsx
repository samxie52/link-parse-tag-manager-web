"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users } from "lucide-react"

const groups = [
  { id: "all", name: "All Groups", count: 1234, color: "bg-gray-500" },
  { id: "marketing", name: "Marketing Team", count: 456, color: "bg-blue-500" },
  { id: "product", name: "Product Team", count: 234, color: "bg-green-500" },
  { id: "sales", name: "Sales Team", count: 345, color: "bg-purple-500" },
  { id: "design", name: "Design Team", count: 199, color: "bg-orange-500" },
]

export function GroupSelector() {
  const [selectedGroup, setSelectedGroup] = useState("all")

  return (
    <div className="flex items-center justify-between bg-background border-b">
      <div className="flex items-center space-x-4 p-4">
        <Users className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-medium">Groups</h3>

        {/* Desktop Group Tabs */}
        <div className="hidden md:flex items-center space-x-2">
          {groups.map((group) => (
            <Button
              key={group.id}
              variant={selectedGroup === group.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedGroup(group.id)}
              className="flex items-center space-x-2"
            >
              <div className={`w-2 h-2 rounded-full ${group.color}`} />
              <span>{group.name}</span>
              <Badge variant="secondary" className="text-xs">
                {group.count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Mobile Group Selector */}
        <div className="md:hidden">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${group.color}`} />
                    <span>{group.name}</span>
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {group.count}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="flex items-center space-x-2 p-4">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground">Live</span>
        </div>
      </div>
    </div>
  )
}
