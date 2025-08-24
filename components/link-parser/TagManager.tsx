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
  tags = [], // 确保默认值为空数组
  editable = false,
  onChange,
  className
}: TagManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newTag, setNewTag] = useState('')

  // 确保 tags 是数组并添加调试信息
  const safeTags = Array.isArray(tags) ? tags : []
  
  // 调试信息
  console.log('TagManager received tags:', tags)
  console.log('TagManager safeTags:', safeTags)
  console.log('TagManager safeTags.length:', safeTags.length)

  const handleAddTag = () => {
    if (newTag.trim() && !safeTags.includes(newTag.trim())) {
      const updatedTags = [...safeTags, newTag.trim()]
      onChange?.(updatedTags)
      setNewTag('')
      setIsAdding(false)
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = safeTags.filter(tag => tag !== tagToRemove)
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

      {/* 调试信息显示 - 临时添加用于调试 */}
      <div className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
        <div>TagManager 调试信息:</div>
        <div>接收到的 tags: {JSON.stringify(tags)}</div>
        <div>处理后的 safeTags: {JSON.stringify(safeTags)}</div>
        <div>safeTags 长度: {safeTags.length}</div>
        <div>editable: {String(editable)}</div>
        <div>isAdding: {String(isAdding)}</div>
      </div>

      <div className="flex flex-wrap gap-2">
        {safeTags.length > 0 ? (
          safeTags.map((tag, index) => (
            <Badge
              key={`${tag}-${index}`} // 使用更稳定的 key
              variant="secondary"
              className={cn(
                "text-xs inline-flex items-center",
                editable && "pr-1"
              )}
            >
              <span className="mr-1">{tag}</span>
              {editable && (
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
                  type="button"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              )}
            </Badge>
          ))
        ) : (
          !isAdding && (
            <span className="text-sm text-muted-foreground italic">暂无标签</span>
          )
        )}

        {/* 添加标签按钮 - 在编辑模式下且不在添加状态时显示 */}
        {editable && !isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-6 px-2 text-xs"
          >
            <Plus className="h-3 w-3 mr-1" />
            添加标签
          </Button>
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
