"use client"

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Edit2, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { EditableFieldProps } from './types'

export function EditableField({
  label,
  value,
  type = 'text',
  editable = false,
  placeholder,
  onChange,
  className
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value?.toString() || '')

  const handleSave = () => {
    if (onChange) {
      const newValue = type === 'number' ? Number(editValue) : editValue
      onChange(newValue)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value?.toString() || '')
    setIsEditing(false)
  }

  const handleEdit = () => {
    setEditValue(value?.toString() || '')
    setIsEditing(true)
  }

  const renderDisplayValue = () => {
    if (!value && !placeholder) return '-'
    
    const displayValue = value?.toString() || placeholder || ''
    
    if (type === 'url' && value) {
      return (
        <a 
          href={displayValue} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          {displayValue}
        </a>
      )
    }
    
    return (
      <span className={cn(
        "break-words",
        !value && "text-muted-foreground italic"
      )}>
        {displayValue}
      </span>
    )
  }

  const renderInput = () => {
    const commonProps = {
      value: editValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setEditValue(e.target.value),
      placeholder,
      className: "min-w-0"
    }

    switch (type) {
      case 'textarea':
        return <Textarea {...commonProps} rows={3} />
      case 'number':
        return <Input {...commonProps} type="number" />
      case 'url':
        return <Input {...commonProps} type="url" />
      default:
        return <Input {...commonProps} type="text" />
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="text-sm font-medium">{label}</Label>
      
      {isEditing ? (
        <div className="space-y-2">
          {renderInput()}
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              className="h-8 px-3"
            >
              <Check className="h-3 w-3 mr-1" />
              保存
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              className="h-8 px-3"
            >
              <X className="h-3 w-3 mr-1" />
              取消
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {renderDisplayValue()}
          </div>
          {editable && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEdit}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
