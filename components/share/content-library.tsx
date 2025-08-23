"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Edit, Share2, Archive, Sparkles, ExternalLink } from "lucide-react"
import type { ParsedContent } from "@/lib/link-parser"

interface ContentLibraryProps {
  contents: ParsedContent[]
  onEdit: (content: ParsedContent) => void
}

export function ContentLibrary({ contents, onEdit }: ContentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredContents = contents.filter((content) => {
    const matchesSearch =
      content.metadata.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.metadata.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "ai-enhanced" && content.isAiEnhanced) ||
      (activeTab === "drafts" && content.status === "draft") ||
      (activeTab === "published" && content.status === "published")

    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="heading text-xl">Content Library</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({contents.length})</TabsTrigger>
          <TabsTrigger value="ai-enhanced">AI Enhanced ({contents.filter((c) => c.isAiEnhanced).length})</TabsTrigger>
          <TabsTrigger value="drafts">Drafts ({contents.filter((c) => c.status === "draft").length})</TabsTrigger>
          <TabsTrigger value="published">
            Published ({contents.filter((c) => c.status === "published").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredContents.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-muted-foreground">No content found</p>
                  <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContents.map((content) => (
                <Card key={content.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <img src={content.metadata.favicon || "/placeholder.svg"} alt="" className="h-4 w-4" />
                        <span className="text-xs text-muted-foreground">{content.metadata.domain}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(content)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit Link
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{content.metadata.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{content.metadata.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {content.isAiEnhanced && (
                          <Badge className="bg-accent text-accent-foreground">
                            <Sparkles className="mr-1 h-3 w-3" />
                            AI Enhanced
                          </Badge>
                        )}
                        <Badge variant="outline" className="capitalize">
                          {content.status}
                        </Badge>
                        {content.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{content.shareCount} shares</span>
                        <span>{new Date(content.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
