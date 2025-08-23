"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { UrlInput } from "@/components/share/url-input"
import { LinkPreview } from "@/components/share/link-preview"
import { ContentLibrary } from "@/components/share/content-library"
import { Loader2 } from "lucide-react"
import type { LinkMetadata, ParsedContent } from "@/lib/link-parser"

export default function SharePage() {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [currentMetadata, setCurrentMetadata] = useState<LinkMetadata | null>(null)
  const [savedContents, setSavedContents] = useState<ParsedContent[]>([
    // Mock data for demonstration
    {
      id: "1",
      metadata: {
        url: "https://github.com/example/repo",
        title: "Advanced React Components Library",
        description: "A comprehensive collection of reusable React components built with TypeScript.",
        domain: "github.com",
        favicon: "/github-favicon.png",
        image: "/github-repository.png",
        author: "Developer Team",
      },
      content:
        "This repository contains a well-structured collection of React components that can be used across different projects. The components are built with accessibility and performance in mind.",
      isAiEnhanced: true,
      tags: ["react", "typescript", "components", "ai-enhanced"],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T11:30:00Z",
      shareCount: 245,
      status: "published",
    },
    {
      id: "2",
      metadata: {
        url: "https://medium.com/example-article",
        title: "The Future of Web Development",
        description: "Exploring emerging trends and technologies in modern web development.",
        domain: "medium.com",
        favicon: "/medium-favicon.png",
        image: "/web-development-article.png",
        author: "Tech Writer",
        publishedAt: "2024-01-10",
      },
      content:
        "An insightful article discussing the evolution of web development practices and upcoming technologies that will shape the industry.",
      isAiEnhanced: false,
      tags: ["web-development", "trends", "technology"],
      createdAt: "2024-01-12T14:20:00Z",
      updatedAt: "2024-01-12T14:20:00Z",
      shareCount: 89,
      status: "draft",
    },
  ])

  useEffect(() => {
    setMounted(true)
  }, [])

  // 防止水合不匹配 - 等待客户端挂载和翻译准备完成
  if (!mounted || !ready) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  const handleParsed = (metadata: LinkMetadata) => {
    setCurrentMetadata(metadata)
  }

  const handleSave = (content: ParsedContent) => {
    setSavedContents((prev) => [content, ...prev])
    setCurrentMetadata(null)
  }

  const handleCancel = () => {
    setCurrentMetadata(null)
  }

  const handleEdit = (content: ParsedContent) => {
    setCurrentMetadata(content.metadata)
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="heading text-3xl text-foreground" suppressHydrationWarning>{t("shareManageLinks")}</h1>
            <p className="body-text text-muted-foreground mt-1" suppressHydrationWarning>
              {t("sharePageDescription")}
            </p>
          </div>

          {/* URL Input */}
          {!currentMetadata && <UrlInput onParsed={handleParsed} />}

          {/* Link Preview */}
          {currentMetadata && <LinkPreview metadata={currentMetadata} onSave={handleSave} onCancel={handleCancel} />}

          {/* Content Library */}
          <ContentLibrary contents={savedContents} onEdit={handleEdit} />
        </div>
      </MainLayout>
    </ProtectedRoute>
  )
}
