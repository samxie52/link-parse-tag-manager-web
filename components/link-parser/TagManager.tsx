"use client"

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Plus, Edit2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TagManagerProps } from './types'

export function TagManager({
  tags,
  editable = false,
  onChange,
  className
}: TagManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTag, setNewTag] = useState('')

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()]
      onChange?.(updatedTags)
      setNewTag('')
      setIsAdding(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove)
    onChange?.(updatedTags)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag()
    } else if (e.key === 'Escape') {
      setNewTag('')
      setIsAdding(false)
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">标签</Label>
        {editable && !isAdding && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(true)}
            className="h-8 px-2"
          >
            <Plus className="h-3 w-3 mr-1" />
            添加
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={cn(
              "text-xs",
              editable && "pr-1"
            )}
          >
            <span className="mr-1">{tag}</span>
            {editable && (
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
              >
                <X className="h-2.5 w-2.5" />
              </button>
            )}
          </Badge>
        ))}

        {tags.length === 0 && !isAdding && (
          <span className="text-sm text-muted-foreground italic">暂无标签</span>
        )}
      </div>

      {isAdding && (
        <div className="flex gap-2 items-center">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="输入标签名称"
            className="h-8 text-xs"
            autoFocus
          />
          <Button
            size="sm"
            onClick={handleAddTag}
            disabled={!newTag.trim()}
            className="h-8 px-3"
          >
            添加
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setNewTag('')
              setIsAdding(false)
            }}
            className="h-8 px-3"
          >
            取消
          </Button>
        </div>
      )}
    </div>
  )
}
