"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, X } from "lucide-react"

interface FilterSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function FilterSidebar({ isOpen, onClose }: FilterSidebarProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:relative lg:inset-auto">
      {/* Mobile overlay */}
      <div className="fixed inset-0 bg-black/50 lg:hidden" onClick={onClose} />

      <div className="fixed right-0 top-0 h-full w-80 lg:relative lg:w-full lg:h-auto flex flex-col">
        {/* Filter Card - positioned horizontally above groups */}
        <Card id="filter-card" className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Quick Filters
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {/* Horizontal filter buttons */}
            <div className="flex flex-wrap gap-2">
              {["All", "Basic", "AI Enhanced", "Shared", "Draft"].map((type) => (
                <Button
                  key={type}
                  variant={selectedTypes.includes(type) ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => {
                    if (selectedTypes.includes(type)) {
                      setSelectedTypes(selectedTypes.filter((t) => t !== type))
                    } else {
                      setSelectedTypes([...selectedTypes, type])
                    }
                  }}
                >
                  {type}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Groups Section - horizontal layout */}
        <div id="group-div" className="flex-1">
          <Card className="h-full">
            <CardContent className="space-y-6 p-6">
              {/* Group Filter */}
              <div className="space-y-3">
                <h4 className="font-medium">Groups</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {["All Groups", "My Groups", "Recent"].map((quickFilter) => (
                    <Button key={quickFilter} variant="outline" size="sm" className="text-xs h-7 bg-transparent">
                      {quickFilter}
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {["Marketing Team", "Product Team", "Sales Team", "Design Team"].map((group) => (
                    <div key={group} className="flex items-center space-x-2">
                      <Checkbox
                        id={group}
                        checked={selectedGroups.includes(group)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedGroups([...selectedGroups, group])
                          } else {
                            setSelectedGroups(selectedGroups.filter((g) => g !== group))
                          }
                        }}
                      />
                      <label htmlFor={group} className="text-sm">
                        {group}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div className="space-y-3">
                <h4 className="font-medium">Date Range</h4>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div className="space-y-3">
                <h4 className="font-medium">Sort By</h4>
                <Select defaultValue="recent">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="shares">Most Shared</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              {(selectedTypes.length > 0 || selectedGroups.length > 0) && (
                <div className="space-y-3">
                  <h4 className="font-medium">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTypes.map((type) => (
                      <Badge key={type} variant="secondary" className="text-xs">
                        {type}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => setSelectedTypes(selectedTypes.filter((t) => t !== type))}
                        />
                      </Badge>
                    ))}
                    {selectedGroups.map((group) => (
                      <Badge key={group} variant="secondary" className="text-xs">
                        {group}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => setSelectedGroups(selectedGroups.filter((g) => g !== group))}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear All */}
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSelectedTypes([])
                  setSelectedGroups([])
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
