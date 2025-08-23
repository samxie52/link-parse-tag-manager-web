"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, MoreHorizontal, Edit, Share2, Archive, Sparkles, ExternalLink, Loader2 } from "lucide-react"
import type { ParsedContent } from "@/lib/link-parser"

interface ContentLibraryProps {
  contents: ParsedContent[]
  onEdit: (content: ParsedContent) => void
}

export function ContentLibrary({ contents, onEdit }: ContentLibraryProps) {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    setMounted(true)
  }, [])

  // 防止水合不匹配
  if (!mounted || !ready) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </CardContent>
        </Card>
      </div>
    )
  }

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
        <h2 className="heading text-xl" suppressHydrationWarning>{t("contentLibrary")}</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchContent")}
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
          <TabsTrigger value="all">
            <span suppressHydrationWarning>{t("all")} ({contents.length})</span>
          </TabsTrigger>
          <TabsTrigger value="ai-enhanced">
            <span suppressHydrationWarning>{t("aiEnhanced")} ({contents.filter((c) => c.isAiEnhanced).length})</span>
          </TabsTrigger>
          <TabsTrigger value="drafts">
            <span suppressHydrationWarning>{t("drafts")} ({contents.filter((c) => c.status === "draft").length})</span>
          </TabsTrigger>
          <TabsTrigger value="published">
            <span suppressHydrationWarning>{t("published")} ({contents.filter((c) => c.status === "published").length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredContents.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-muted-foreground" suppressHydrationWarning>{t("noContentFound")}</p>
                  <p className="text-sm text-muted-foreground mt-1" suppressHydrationWarning>{t("tryAdjustingFilters")}</p>
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
                            <span suppressHydrationWarning>{t("edit")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            <span suppressHydrationWarning>{t("share")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            <span suppressHydrationWarning>{t("visitLink")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" />
                            <span suppressHydrationWarning>{t("archive")}</span>
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
                            <span suppressHydrationWarning>{t("aiEnhanced")}</span>
                          </Badge>
                        )}
                        <Badge variant="outline" className="capitalize" suppressHydrationWarning>
                          {t(content.status)}
                        </Badge>
                        {content.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span suppressHydrationWarning>{content.shareCount} {t("shares")}</span>
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
