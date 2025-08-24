"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Heart, MessageCircle, Bookmark, Share2, Eye, User, Calendar, Hash, Play } from 'lucide-react'
import { EditableField } from '../EditableField'
import { cn } from '@/lib/utils'
import type { XiaoHongShuMetadataProps } from '../types'

export function XiaoHongShuMetadata({
  metadata,
  editable = false,
  onChange
}: XiaoHongShuMetadataProps) {
  const handleFieldChange = (field: keyof typeof metadata, value: any) => {
    if (onChange) {
      onChange({
        ...metadata,
        [field]: value
      })
    }
  }

  const formatCount = (count: string | number) => {
    const num = typeof count === 'string' ? parseInt(count) || 0 : count
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`
    }
    return num.toString()
  }

  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return '-'
    return new Date(dateTime).toLocaleString('zh-CN')
  }

  return (
    <Card className="w-full border-red-200 bg-gradient-to-br from-red-50 to-pink-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-red-700">
          <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">小</span>
          </div>
          小红书信息
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 笔记基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField
            label="笔记ID"
            value={metadata.note_id}
            type="text"
            editable={editable}
            onChange={(value) => handleFieldChange('note_id', value)}
          />
          
          <EditableField
            label="分享码"
            value={metadata.share_code}
            type="text"
            editable={editable}
            onChange={(value) => handleFieldChange('share_code', value)}
          />
        </div>

        {/* 作者信息 */}
        <div className="bg-white/60 rounded-lg p-4 border border-red-100">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-red-100 text-red-700">
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <EditableField
                label="作者"
                value={metadata.author}
                type="text"
                editable={editable}
                onChange={(value) => handleFieldChange('author', value)}
                className="mb-2"
              />
              <EditableField
                label="作者ID"
                value={metadata.author_id}
                type="text"
                editable={editable}
                onChange={(value) => handleFieldChange('author_id', value)}
              />
            </div>
          </div>
        </div>

        {/* 互动数据 */}
        <div className="bg-white/60 rounded-lg p-4 border border-red-100">
          <div className="text-sm font-medium text-red-700 mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4" />
            互动数据
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                <Heart className="h-4 w-4" />
              </div>
              <div className="text-lg font-bold text-red-700">
                {formatCount(metadata.like_count)}
              </div>
              <div className="text-xs text-red-600">点赞</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div className="text-lg font-bold text-red-700">
                {formatCount(metadata.comment_count)}
              </div>
              <div className="text-xs text-red-600">评论</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                <Bookmark className="h-4 w-4" />
              </div>
              <div className="text-lg font-bold text-red-700">
                {formatCount(metadata.collect_count)}
              </div>
              <div className="text-xs text-red-600">收藏</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                <Share2 className="h-4 w-4" />
              </div>
              <div className="text-lg font-bold text-red-700">
                {formatCount(metadata.share_count)}
              </div>
              <div className="text-xs text-red-600">分享</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
                <Eye className="h-4 w-4" />
              </div>
              <div className="text-lg font-bold text-red-700">
                {formatCount(metadata.view_count)}
              </div>
              <div className="text-xs text-red-600">浏览</div>
            </div>
          </div>
        </div>

        {/* 笔记类型和时长 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">笔记类型</div>
            <Badge 
              variant="outline" 
              className={cn(
                "border-red-200 text-red-700",
                metadata.note_type === 'video' && "bg-red-100"
              )}
            >
              {metadata.note_type === 'video' && <Play className="h-3 w-3 mr-1" />}
              {metadata.note_type === 'video' ? '视频笔记' : '图文笔记'}
            </Badge>
          </div>
          
          {metadata.video_duration && metadata.note_type === 'video' && (
            <EditableField
              label="视频时长"
              value={metadata.video_duration}
              type="text"
              editable={editable}
              onChange={(value) => handleFieldChange('video_duration', value)}
            />
          )}
        </div>

        {/* 发布时间 */}
        {metadata.published_at && (
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              发布时间
            </div>
            <div className="text-sm text-muted-foreground">
              {formatDateTime(metadata.published_at)}
            </div>
          </div>
        )}

        {/* 标签 */}
        {metadata.tags && metadata.tags.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium flex items-center gap-2">
              <Hash className="h-4 w-4" />
              笔记标签
            </div>
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-red-100 text-red-700 border-red-200 text-xs"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 媒体统计 */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-red-100">
          {metadata.images && metadata.images.length > 0 && (
            <div className="text-center">
              <div className="text-lg font-bold text-red-700">
                {metadata.images.length}
              </div>
              <div className="text-xs text-red-600">图片</div>
            </div>
          )}
          
          {metadata.videos && metadata.videos.length > 0 && (
            <div className="text-center">
              <div className="text-lg font-bold text-red-700">
                {metadata.videos.length}
              </div>
              <div className="text-xs text-red-600">视频</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
