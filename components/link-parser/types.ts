import type { ParseResultData, BasicParseResult, XHSPlatformMetadata, AMAPPlatformMetadata } from '@/lib/api/api-types'

// 主对话框组件属性
export interface LinkParseResultDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  parseResult: ParseResultData | null
  editable?: boolean
  onSave?: (data: ParseResultData) => void
  onEdit?: () => void
}

// 基础信息展示组件属性
export interface BasicSectionProps {
  data: BasicParseResult
  editable?: boolean
  onChange?: (data: BasicParseResult) => void
}

// 平台信息展示组件属性
export interface PlatformSectionProps {
  platform: string
  metadata: Record<string, any>
  editable?: boolean
  onChange?: (metadata: Record<string, any>) => void
}

// AI信息展示组件属性
export interface AISectionProps {
  metadata: Record<string, any>
  editable?: boolean
  onChange?: (metadata: Record<string, any>) => void
}

// 可编辑字段组件属性
export interface EditableFieldProps {
  label: string
  value: string | number
  type?: 'text' | 'textarea' | 'number' | 'url'
  editable?: boolean
  placeholder?: string
  onChange?: (value: string | number) => void
  className?: string
}

// 图片预览组件属性
export interface ImagePreviewProps {
  images: string[]
  thumbnail?: string
  className?: string
}

// 标签管理组件属性
export interface TagManagerProps {
  tags: string[]
  editable?: boolean
  onChange?: (tags: string[]) => void
  className?: string
}

// 小红书元数据组件属性
export interface XiaoHongShuMetadataProps {
  metadata: XHSPlatformMetadata
  editable?: boolean
  onChange?: (metadata: XHSPlatformMetadata) => void
}

// 高德地图元数据组件属性
export interface AmapMetadataProps {
  metadata: AMAPPlatformMetadata
  editable?: boolean
  onChange?: (metadata: AMAPPlatformMetadata) => void
}

// 平台类型枚举
export type PlatformType = 'xiaohongshu' | 'amap' | 'unknown'

// 解析类型枚举
export type ParseType = 'basic' | 'ai_enhanced'
