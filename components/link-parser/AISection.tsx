"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bot, Sparkles, AlertCircle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AISectionProps } from './types'

export function AISection({
  metadata,
  editable = false,
  onChange
}: AISectionProps) {
  // 检查是否有AI元数据
  const hasAIData = metadata && Object.keys(metadata).length > 0

  if (!hasAIData) {
    return (
      <Card className="w-full border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
              <Bot className="h-3 w-3 text-white" />
            </div>
            AI分析
            <Badge variant="outline" className="ml-auto border-purple-200 text-purple-600">
              即将推出
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center space-y-3">
              <div className="relative">
                <Sparkles className="h-12 w-12 mx-auto opacity-30 text-purple-400" />
                <Zap className="h-6 w-6 absolute -top-1 -right-1 text-purple-500 opacity-50" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-purple-700">AI增强功能开发中</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  未来将提供智能标签生成、内容分析、情感识别等AI功能
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // 如果有AI数据，显示具体内容
  return (
    <Card className="w-full border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
            <Bot className="h-3 w-3 text-white" />
          </div>
          AI分析结果
          <Badge variant="outline" className="ml-auto border-purple-200 text-purple-600">
            AI增强
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* AI置信度 */}
        {metadata.confidence_score && (
          <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
            <div className="text-sm font-medium text-purple-700 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI置信度
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-purple-100 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${(metadata.confidence_score * 100)}%` }}
                />
              </div>
              <span className="text-sm font-medium text-purple-700">
                {(metadata.confidence_score * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* AI提供商 */}
        {metadata.ai_provider && (
          <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
            <div className="text-sm font-medium text-purple-700 mb-2">AI服务商</div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 border-purple-200">
              {metadata.ai_provider}
            </Badge>
          </div>
        )}

        {/* AI增强标签 */}
        {metadata.enhanced_tags && metadata.enhanced_tags.length > 0 && (
          <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
            <div className="text-sm font-medium text-purple-700 mb-3 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI增强标签
            </div>
            <div className="flex flex-wrap gap-2">
              {metadata.enhanced_tags.map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 border-purple-200 text-xs"
                >
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* AI分析结果 */}
        {metadata.analysis && (
          <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
            <div className="text-sm font-medium text-purple-700 mb-3">AI分析</div>
            <div className="space-y-3">
              {Object.entries(metadata.analysis).map(([key, value]) => (
                <div key={key} className="grid grid-cols-3 gap-4 py-2 border-b border-purple-100 last:border-b-0">
                  <div className="text-sm font-medium text-purple-600">
                    {key}
                  </div>
                  <div className="col-span-2 text-sm">
                    {typeof value === 'object' ? 
                      JSON.stringify(value, null, 2) : 
                      String(value || '-')
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI描述 */}
        {metadata.ai_description && (
          <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
            <div className="text-sm font-medium text-purple-700 mb-2">AI生成描述</div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {metadata.ai_description}
            </p>
          </div>
        )}

        {/* 其他AI元数据 */}
        {Object.keys(metadata).length > 0 && (
          <div className="bg-white/60 rounded-lg p-4 border border-purple-100">
            <div className="text-sm font-medium text-purple-700 mb-3">详细数据</div>
            <div className="space-y-2 text-xs">
              {Object.entries(metadata)
                .filter(([key]) => !['confidence_score', 'ai_provider', 'enhanced_tags', 'analysis', 'ai_description'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-2 py-1">
                    <div className="text-muted-foreground font-mono">
                      {key}
                    </div>
                    <div className="col-span-2 break-words">
                      {typeof value === 'object' ? 
                        JSON.stringify(value) : 
                        String(value || '-')
                      }
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
