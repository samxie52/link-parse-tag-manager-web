"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FilterSidebar } from "@/components/dashboard/filter-sidebar"
import { GroupSelector } from "@/components/dashboard/group-selector"
import { ContentTimeline } from "@/components/dashboard/content-timeline"
import { Share2, Sparkles, Clock, Users, Filter, Plus } from "lucide-react"

export default function Dashboard() {
  const [showFilters, setShowFilters] = useState(false)

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="flex flex-col h-full">
          {/* Group Selector Navigation */}
          <GroupSelector />

          <div className="flex flex-1 overflow-hidden">
            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="heading text-3xl text-foreground">Content Timeline</h1>
                    <p className="body-text text-muted-foreground mt-1">
                      Manage your content and track performance in real-time
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="mr-2 h-4 w-4" />
                      New Content
                    </Button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                      <Share2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">AI Enhanced</CardTitle>
                      <Sparkles className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">456</div>
                      <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">12</div>
                      <p className="text-xs text-muted-foreground">+2 new this month</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">89</div>
                      <p className="text-xs text-muted-foreground">+12% from yesterday</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Content Timeline */}
                <ContentTimeline />
              </div>
            </div>

            {/* Filter Sidebar - Desktop */}
            <div className="hidden lg:block w-80 border-l bg-background/50">
              <FilterSidebar isOpen={true} onClose={() => {}} />
            </div>
          </div>

          {/* Filter Sidebar - Mobile */}
          <FilterSidebar isOpen={showFilters} onClose={() => setShowFilters(false)} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
