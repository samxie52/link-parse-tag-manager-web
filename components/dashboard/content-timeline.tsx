"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Share2, Sparkles, Eye, Heart, MessageCircle, MoreHorizontal } from "lucide-react"

interface ContentItem {
  id: string
  title: string
  description: string
  type: "basic" | "ai-enhanced"
  timestamp: string
  shares: number
  views: number
  likes: number
  comments: number
  group: string
  author: string
  thumbnail?: string
}

const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "Product Launch Article",
    description: "Comprehensive guide to our new product features and benefits",
    type: "basic",
    timestamp: "2 hours ago",
    shares: 245,
    views: 1200,
    likes: 89,
    comments: 23,
    group: "Marketing Team",
    author: "Sarah Chen",
  },
  {
    id: "2",
    title: "Marketing Campaign Analysis",
    description: "AI-generated insights and recommendations for Q4 campaigns",
    type: "ai-enhanced",
    timestamp: "1 hour ago",
    shares: 1200,
    views: 5400,
    likes: 234,
    comments: 67,
    group: "Marketing Team",
    author: "AI Assistant",
  },
  {
    id: "3",
    title: "Team Update Newsletter",
    description: "Monthly team achievements and upcoming project milestones",
    type: "basic",
    timestamp: "3 hours ago",
    shares: 89,
    views: 456,
    likes: 34,
    comments: 12,
    group: "Product Team",
    author: "Mike Johnson",
  },
  {
    id: "4",
    title: "Customer Success Stories",
    description: "AI-curated collection of customer testimonials and case studies",
    type: "ai-enhanced",
    timestamp: "4 hours ago",
    shares: 567,
    views: 2300,
    likes: 145,
    comments: 45,
    group: "Sales Team",
    author: "AI Assistant",
  },
  {
    id: "5",
    title: "Design System Updates",
    description: "Latest improvements to our component library and design tokens",
    type: "basic",
    timestamp: "5 hours ago",
    shares: 123,
    views: 789,
    likes: 67,
    comments: 18,
    group: "Design Team",
    author: "Emma Wilson",
  },
  {
    id: "6",
    title: "Market Research Insights",
    description: "AI-powered analysis of industry trends and competitive landscape",
    type: "ai-enhanced",
    timestamp: "6 hours ago",
    shares: 890,
    views: 3400,
    likes: 189,
    comments: 56,
    group: "Product Team",
    author: "AI Assistant",
  },
]

export function ContentTimeline() {
  const [content, setContent] = useState<ContentItem[]>(mockContent)
  const [isLoading, setIsLoading] = useState(false)

  // Mock real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setContent((prev) =>
        prev.map((item) => ({
          ...item,
          views: item.views + Math.floor(Math.random() * 10),
          likes: item.likes + Math.floor(Math.random() * 3),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const BasicContentCard = ({ item }: { item: ContentItem }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 bg-[#FAFAFA] border border-[#E8E8E8] hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="bg-gray-100 text-gray-700">
            Basic
          </Badge>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground">{item.timestamp}</span>
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
        <CardDescription className="text-sm">{item.description}</CardDescription>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>{item.group}</span>
          <span>•</span>
          <span>{item.author}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{item.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 className="h-4 w-4" />
              <span>{item.shares}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{item.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{item.comments}</span>
            </div>
          </div>
          {/* <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Upgrade</Button> */}
        </div>
      </CardContent>
    </Card>
  )

  const AIEnhancedCard = ({ item }: { item: ContentItem }) => (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white border-0">
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge className="bg-white/20 text-white border-white/30 animate-pulse">
            <Sparkles className="mr-1 h-3 w-3" />
            AI Enhanced
          </Badge>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-white/80">{item.timestamp}</span>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg leading-tight text-white">{item.title}</CardTitle>
        <CardDescription className="text-sm text-white/90">{item.description}</CardDescription>
        <div className="flex items-center space-x-2 text-xs text-white/80">
          <span>{item.group}</span>
          <span>•</span>
          <span>{item.author}</span>
        </div>
      </CardHeader>
      <CardContent className="relative pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-white/90">
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{item.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 className="h-4 w-4" />
              <span>{item.shares}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{item.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{item.comments}</span>
            </div>
          </div>
          <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Content Grid with Masonry Layout */}
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {content.map((item) => (
          <div key={item.id} className="break-inside-avoid">
            {item.type === "basic" ? <BasicContentCard item={item} /> : <AIEnhancedCard item={item} />}
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center">
        <Button variant="outline" onClick={() => setIsLoading(true)} disabled={isLoading}>
          {isLoading ? "Loading..." : "Load More Content"}
        </Button>
      </div>
    </div>
  )
}
