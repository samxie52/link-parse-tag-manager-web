"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ImagePreviewProps } from './types'

export function ImagePreview({
  images,
  thumbnail,
  className
}: ImagePreviewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  if (!images || images.length === 0) {
    return null
  }

  const displayImages = images.filter(img => img && img.trim() !== '')
  if (displayImages.length === 0) {
    return null
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    )
  }

  const handleNext = () => {
    setSelectedIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    )
  }

  const handleImageClick = (index: number) => {
    setSelectedIndex(index)
    setIsOpen(true)
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="text-sm font-medium">图片</div>
      
      {/* 缩略图网格 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {displayImages.slice(0, 8).map((image, index) => (
          <div
            key={index}
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-md border"
            onClick={() => handleImageClick(index)}
          >
            <Image
              src={image}
              alt={`图片 ${index + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </div>
        ))}
        
        {/* 显示更多图片的指示器 */}
        {displayImages.length > 8 && (
          <div
            className="relative aspect-square cursor-pointer group overflow-hidden rounded-md border bg-muted flex items-center justify-center"
            onClick={() => handleImageClick(8)}
          >
            <div className="text-center">
              <div className="text-lg font-semibold">+{displayImages.length - 8}</div>
              <div className="text-xs text-muted-foreground">更多</div>
            </div>
          </div>
        )}
      </div>

      {/* 图片预览对话框 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            {/* 关闭按钮 */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>

            {/* 上一张按钮 */}
            {displayImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {/* 下一张按钮 */}
            {displayImages.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:bg-white/20"
                onClick={handleNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            {/* 当前图片 */}
            <div className="relative w-full h-full">
              <Image
                src={displayImages[selectedIndex]}
                alt={`图片 ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* 图片计数器 */}
            {displayImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {selectedIndex + 1} / {displayImages.length}
              </div>
            )}
          </div>

          {/* 缩略图导航 */}
          {displayImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg max-w-xs overflow-x-auto">
              {displayImages.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    "relative w-12 h-12 rounded border-2 overflow-hidden flex-shrink-0",
                    selectedIndex === index 
                      ? "border-white" 
                      : "border-transparent opacity-60 hover:opacity-80"
                  )}
                  onClick={() => setSelectedIndex(index)}
                >
                  <Image
                    src={image}
                    alt={`缩略图 ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
