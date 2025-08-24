"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { MainLayout } from "@/components/layout/main-layout"
import { UrlInput } from "@/components/share/url-input"
import { LinkPreview } from "@/components/share/link-preview"
import { ContentLibrary } from "@/components/share/content-library"
import { LinkParseResultDialog } from "@/components/link-parser"
import { parseUrl } from "@/lib/link-parser"
import { Button } from "@/components/ui/button"
import { Loader2, Link } from "lucide-react"
import type { LinkMetadata, ParsedContent } from "@/lib/link-parser"
import type { ParseResponse } from "@/lib/api/api-types"

export default function SharePage() {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [currentMetadata, setCurrentMetadata] = useState<LinkMetadata | null>(null)
  const [parseResult, setParseResult] = useState<ParseResponse | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

  // 使用新的解析API
  const handleParseUrl = async (url: string) => {
    setIsLoading(true)
    try {
      const result = await parseUrl(url)
      setParseResult(result)
      setIsDialogOpen(true)
    } catch (error) {
      console.error('Parse failed:', error)
      // 可以添加错误提示
    } finally {
      setIsLoading(false)
    }
  }

  const handleParsed = (parseResult: ParseResponse) => {
    console.log('handleParsed called with:', parseResult)
    console.log('parseResult.data:', parseResult?.data)
    console.log('parseResult.parse_result:', parseResult?.parse_result)
    
    setParseResult(parseResult)
    setIsDialogOpen(true)
    
    console.log('Dialog should be open now, isDialogOpen will be:', true)
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

  // 处理新组件的保存
  const handleDialogSave = async (data: any) => {
    try {
      // 这里可以调用API保存数据
      console.log('Saving parsed data:', data)
      
      // 转换为旧格式以兼容现有的ContentLibrary
      const parsedContent: ParsedContent = {
        id: Date.now().toString(),
        metadata: {
          url: data.basic?.url || '',
          title: data.basic?.title || '',
          description: data.basic?.description || '',
          domain: new URL(data.basic?.url || '').hostname,
          favicon: '',
          image: data.basic?.images?.[0] || '',
          author: data.basic?.author || '',
        },
        content: data.basic?.description || '',
        isAiEnhanced: data.parse_type === 'ai_enhanced',
        tags: data.basic?.tags || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shareCount: 0,
        status: "draft",
      }
      
      setSavedContents((prev) => [parsedContent, ...prev])
      setIsDialogOpen(false)
      setParseResult(null)
    } catch (error) {
      console.error('Save failed:', error)
    }
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

          {/* URL Input with New Parser */}
          <div className="space-y-4">
            <UrlInput onParsed={handleParsed} />
            
            {/* 添加新的解析按钮用于测试 */}
            <div className="flex gap-2">
              <Button 
                onClick={() => handleParseUrl('https://www.xiaohongshu.com/explore/123456')}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Link className="h-4 w-4 mr-2" />}
                测试小红书链接
              </Button>
              <Button 
                onClick={() => handleParseUrl('https://ditu.amap.com/place/B000A83M9D')}
                disabled={isLoading}
                variant="outline"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Link className="h-4 w-4 mr-2" />}
                测试高德地图链接
              </Button>
            </div>
          </div>

          {/* 旧的 Link Preview - 保持兼容性 */}
          {currentMetadata && <LinkPreview metadata={currentMetadata} onSave={handleSave} onCancel={handleCancel} />}

          {/* Content Library */}
          <ContentLibrary contents={savedContents} onEdit={handleEdit} />
        </div>

        {/* 新的解析结果对话框 */}
        <LinkParseResultDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          parseResult={parseResult?.parse_result || null}
          editable={true}
          onSave={handleDialogSave}
        />
        
        {/* 调试信息 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="fixed bottom-4 right-4 bg-yellow-100 p-4 rounded-lg shadow-lg max-w-md">
            <h3 className="font-bold text-sm">调试信息:</h3>
            <p className="text-xs">isDialogOpen: {String(isDialogOpen)}</p>
            <p className="text-xs">parseResult: {parseResult ? 'exists' : 'null'}</p>
            <p className="text-xs">parseResult.parse_result: {parseResult?.parse_result ? 'exists' : 'null'}</p>
          </div>
        )}
      </MainLayout>
    </ProtectedRoute>
  )
}
