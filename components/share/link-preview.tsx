"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit3, Save, X, Sparkles, Share2, ExternalLink } from "lucide-react"
import type { LinkMetadata, ParsedContent } from "@/lib/link-parser"

interface LinkPreviewProps {
  metadata: LinkMetadata
  onSave: (content: ParsedContent) => void
  onCancel: () => void
}

export function LinkPreview({ metadata, onSave, onCancel }: LinkPreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(metadata.title)
  const [description, setDescription] = useState(metadata.description)
  const [content, setContent] = useState(metadata.description)
  const [tags, setTags] = useState<string[]>(["web", "content"])

  const handleSave = () => {
    const parsedContent: ParsedContent = {
      id: Date.now().toString(),
      metadata: {
        ...metadata,
        title,
        description,
      },
      content,
      isAiEnhanced: false,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shareCount: 0,
      status: "draft",
    }

    onSave(parsedContent)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <img src={metadata.favicon || "/placeholder.svg"} alt="" className="h-5 w-5" />
            Link Preview
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
              Close
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Preview Card */}
        <div className="border rounded-lg overflow-hidden">
          {metadata.image && (
            <img src={metadata.image || "/placeholder.svg"} alt={title} className="w-full h-48 object-cover" />
          )}
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{metadata.domain}</span>
              {metadata.publishedAt && (
                <>
                  <span>•</span>
                  <span>{new Date(metadata.publishedAt).toLocaleDateString()}</span>
                </>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
              </>
            )}

            {metadata.author && <p className="text-sm text-muted-foreground">By {metadata.author}</p>}
          </div>
        </div>

        <Separator />

        {/* Content Editor */}
        <div className="space-y-3">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Add your thoughts, summary, or additional context..."
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
            <Button variant="outline" size="sm">
              Add Tag
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
          <Button variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            Enhance with AI
          </Button>
          <Button variant="outline">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
