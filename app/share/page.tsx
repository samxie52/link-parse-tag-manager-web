"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { UrlInput } from "@/components/share/url-input"
import { LinkPreview } from "@/components/share/link-preview"
import { ContentLibrary } from "@/components/share/content-library"
import type { LinkMetadata, ParsedContent } from "@/lib/link-parser"

export default function SharePage() {
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
            <h1 className="heading text-3xl text-foreground">Share & Manage Links</h1>
            <p className="body-text text-muted-foreground mt-1">
              Parse links, enhance content with AI, and manage your shared content library
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
