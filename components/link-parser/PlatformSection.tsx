"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Layers, AlertCircle } from 'lucide-react'
import { XiaoHongShuMetadata, AmapMetadata } from './platforms'
import { cn } from '@/lib/utils'
import type { PlatformSectionProps, XHSPlatformMetadata, AMAPPlatformMetadata } from './types'

export function PlatformSection({
  platform,
  metadata,
  editable = false,
  onChange
}: PlatformSectionProps) {
  // 如果没有平台特定数据，显示空状态
  if (!metadata || Object.keys(metadata).length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            平台信息
            <Badge variant="outline" className="ml-auto">
              {platform || '未知平台'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">暂无平台特定信息</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 根据平台类型渲染对应的组件
  const renderPlatformMetadata = () => {
    const normalizedPlatform = platform?.toLowerCase()

    switch (normalizedPlatform) {
      case 'xiaohongshu':
      case 'xhs':
        return (
          <XiaoHongShuMetadata
            metadata={metadata as XHSPlatformMetadata}
            editable={editable}
            onChange={onChange as (metadata: XHSPlatformMetadata) => void}
          />
        )
      
      case 'amap':
      case 'gaode':
        return (
          <AmapMetadata
            metadata={metadata as AMAPPlatformMetadata}
            editable={editable}
            onChange={onChange as (metadata: AMAPPlatformMetadata) => void}
          />
        )
      
      default:
        // 未知平台，显示通用的键值对展示
        return (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                平台信息
                <Badge variant="outline" className="ml-auto">
                  {platform || '未知平台'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(metadata).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b border-muted last:border-b-0">
                    <div className="text-sm font-medium text-muted-foreground">
                      {key}
                    </div>
                    <div className="col-span-2 text-sm break-words">
                      {typeof value === 'object' ? 
                        JSON.stringify(value, null, 2) : 
                        String(value || '-')
                      }
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )
    }
  }

  return renderPlatformMetadata()
}
