"use client"

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, Edit2, Copy, ExternalLink, Sparkles, Target, Layers, Bot } from 'lucide-react'
import { toast } from 'sonner'
import { BasicSection } from './BasicSection'
import { PlatformSection } from './PlatformSection'
import { AISection } from './AISection'
import { cn } from '@/lib/utils'
import type { LinkParseResultDialogProps, ParseResultData } from './types'

export function LinkParseResultDialog({
  open,
  onOpenChange,
  parseResult,
  editable = false,
  onSave,
  onEdit
}: LinkParseResultDialogProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<ParseResultData | null>(null)

  // 当解析结果变化时，重置编辑状态
  useEffect(() => {
    if (parseResult) {
      setEditData({ ...parseResult })
      setIsEditing(false)
    }
  }, [parseResult])

  if (!parseResult) {
    return null
  }

  const isAIEnhanced = parseResult.parse_type === 'ai_enhanced'

  // 处理编辑模式切换
  const handleEditToggle = () => {
    if (isEditing) {
      // 取消编辑，恢复原始数据
      setEditData({ ...parseResult })
      setIsEditing(false)
    } else {
      // 开始编辑
      setIsEditing(true)
      onEdit?.()
    }
  }

  // 处理保存
  const handleSave = () => {
    if (editData && onSave) {
      onSave(editData)
      setIsEditing(false)
      toast.success('保存成功')
    }
  }

  // 处理复制链接
  const handleCopyLink = async () => {
    if (parseResult.basic.thumbnail) {
      try {
        await navigator.clipboard.writeText(parseResult.basic.thumbnail)
        toast.success('链接已复制到剪贴板')
      } catch (error) {
        toast.error('复制失败')
      }
    }
  }

  // 更新基础数据
  const handleBasicChange = (basic: any) => {
    if (editData) {
      setEditData({
        ...editData,
        basic
      })
    }
  }

  // 更新平台数据
  const handlePlatformChange = (metadata: any) => {
    if (editData) {
      setEditData({
        ...editData,
        platform_metadata: metadata
      })
    }
  }

  // 更新AI数据
  const handleAIChange = (metadata: any) => {
    if (editData) {
      setEditData({
        ...editData,
        ai_metadata: metadata
      })
    }
  }

  const currentData = editData || parseResult

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "max-w-4xl w-full max-h-[90vh] p-0 gap-0",
        isAIEnhanced 
          ? "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 border-purple-200" 
          : "bg-gradient-to-br from-gray-50 to-slate-100 border-gray-200"
      )}>
        {/* 对话框头部 */}
        <DialogHeader className={cn(
          "px-6 py-4 border-b",
          isAIEnhanced 
            ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-purple-300" 
            : "bg-gradient-to-r from-gray-600 to-slate-700 text-white border-gray-300"
        )}>
          <DialogTitle className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              isAIEnhanced 
                ? "bg-white/20" 
                : "bg-white/20"
            )}>
              {isAIEnhanced ? (
                <Sparkles className="h-4 w-4" />
              ) : (
                <Target className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span>链接解析结果</span>
                <Badge 
                  variant="secondary" 
                  className={cn(
                    "text-xs",
                    isAIEnhanced 
                      ? "bg-white/20 text-white border-white/30" 
                      : "bg-white/20 text-white border-white/30"
                  )}
                >
                  {isAIEnhanced ? 'AI增强' : '基础解析'}
                </Badge>
                <Badge 
                  variant="outline" 
                  className="bg-white/10 text-white border-white/30 text-xs"
                >
                  {currentData.platform}
                </Badge>
              </div>
              <div className="text-sm opacity-80 mt-1 truncate">
                {currentData.basic.title}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* 对话框内容 */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="overview" className="h-full flex flex-col">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  概览
                </TabsTrigger>
                <TabsTrigger value="platform" className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  平台信息
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  AI分析
                </TabsTrigger>
              </TabsList>
            </div>

            <ScrollArea className="flex-1 px-6 pb-4">
              <div className="space-y-6 py-4">
                <TabsContent value="overview" className="mt-0">
                  <BasicSection
                    data={currentData.basic}
                    editable={editable && isEditing}
                    onChange={handleBasicChange}
                  />
                </TabsContent>

                <TabsContent value="platform" className="mt-0">
                  <PlatformSection
                    platform={currentData.platform}
                    metadata={currentData.platform_metadata || {}}
                    editable={editable && isEditing}
                    onChange={handlePlatformChange}
                  />
                </TabsContent>

                <TabsContent value="ai" className="mt-0">
                  <AISection
                    metadata={currentData.ai_metadata || {}}
                    editable={editable && isEditing}
                    onChange={handleAIChange}
                  />
                </TabsContent>
              </div>
            </ScrollArea>
          </Tabs>
        </div>

        {/* 对话框底部 */}
        <DialogFooter className="px-6 py-4 border-t bg-white/50 backdrop-blur-sm">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              {/* 复制链接按钮 */}
              {currentData.basic.thumbnail && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyLink}
                  className="h-8"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  复制链接
                </Button>
              )}

              {/* 外部链接按钮 */}
              {currentData.basic.thumbnail && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(currentData.basic.thumbnail, '_blank')}
                  className="h-8"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  打开链接
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* 编辑/取消按钮 */}
              {editable && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditToggle}
                  className="h-8"
                >
                  <Edit2 className="h-3 w-3 mr-1" />
                  {isEditing ? '取消编辑' : '编辑'}
                </Button>
              )}

              {/* 保存按钮 */}
              {editable && isEditing && (
                <Button
                  size="sm"
                  onClick={handleSave}
                  className={cn(
                    "h-8",
                    isAIEnhanced 
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700" 
                      : "bg-gradient-to-r from-gray-600 to-slate-700 hover:from-gray-700 hover:to-slate-800"
                  )}
                >
                  <Save className="h-3 w-3 mr-1" />
                  保存
                </Button>
              )}

              {/* 关闭按钮 */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8"
              >
                关闭
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
