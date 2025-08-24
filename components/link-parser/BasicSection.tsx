"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, User, Target } from 'lucide-react'
import { EditableField } from './EditableField'
import { TagManager } from './TagManager'
import { ImagePreview } from './ImagePreview'
import { cn } from '@/lib/utils'
import type { BasicSectionProps } from './types'

export function BasicSection({
  data,
  editable = false,
  onChange
}: BasicSectionProps) {
  const handleFieldChange = (field: keyof typeof data, value: any) => {
    if (onChange) {
      onChange({
        ...data,
        [field]: value
      })
    }
  }

  const formatParseTime = (timeMs: number) => {
    if (timeMs < 1000) {
      return `${timeMs}ms`
    }
    return `${(timeMs / 1000).toFixed(2)}s`
  }

  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(1)}%`
  }

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('zh-CN')
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          基础信息
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 标题 */}
        <EditableField
          label="标题"
          value={data.title}
          type="text"
          editable={editable}
          placeholder="请输入标题"
          onChange={(value) => handleFieldChange('title', value)}
        />

        {/* 描述 */}
        <EditableField
          label="描述"
          value={data.description}
          type="textarea"
          editable={editable}
          placeholder="请输入描述"
          onChange={(value) => handleFieldChange('description', value)}
        />

        {/* 作者 */}
        {data.author && (
          <EditableField
            label="作者"
            value={data.author}
            type="text"
            editable={editable}
            placeholder="请输入作者"
            onChange={(value) => handleFieldChange('author', value)}
          />
        )}

        {/* 发布时间 */}
        {data.published_at && (
          <div className="space-y-2">
            <div className="text-sm font-medium">发布时间</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatDateTime(data.published_at)}
            </div>
          </div>
        )}

        {/* 标签管理 */}
        <TagManager
          tags={data.tags}
          editable={editable}
          onChange={(tags) => handleFieldChange('tags', tags)}
        />

        {/* 图片预览 */}
        {data.images && data.images.length > 0 && (
          <ImagePreview
            images={data.images}
            thumbnail={data.thumbnail}
          />
        )}

        {/* 视频链接 */}
        {data.videos && data.videos.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">视频</div>
            <div className="space-y-2">
              {data.videos.map((video, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    视频 {index + 1}
                  </Badge>
                  <a
                    href={video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm truncate flex-1"
                  >
                    {video}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 缩略图 */}
        {data.thumbnail && !data.images?.includes(data.thumbnail) && (
          <EditableField
            label="缩略图"
            value={data.thumbnail}
            type="url"
            editable={editable}
            placeholder="请输入缩略图URL"
            onChange={(value) => handleFieldChange('thumbnail', value)}
          />
        )}

        {/* 解析统计信息 */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">置信度</div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={data.confidence > 0.8 ? "default" : data.confidence > 0.6 ? "secondary" : "destructive"}
                className="text-xs"
              >
                {formatConfidence(data.confidence)}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">解析耗时</div>
            <div className="text-sm font-medium">
              {formatParseTime(data.parse_time_ms)}
            </div>
          </div>
        </div>

        {/* 解析时间 */}
        <div className="text-xs text-muted-foreground">
          解析时间: {formatDateTime(data.parsed_at)}
        </div>
      </CardContent>
    </Card>
  )
}
