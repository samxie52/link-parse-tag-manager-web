"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Clock, Star, Navigation, Building, Car } from 'lucide-react'
import { EditableField } from '../EditableField'
import { cn } from '@/lib/utils'
import type { AmapMetadataProps } from '../types'

export function AmapMetadata({
  metadata,
  editable = false,
  onChange
}: AmapMetadataProps) {
  const handleFieldChange = (field: keyof typeof metadata, value: any) => {
    if (onChange) {
      onChange({
        ...metadata,
        [field]: value
      })
    }
  }

  const formatCoordinate = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`
  }

  const formatRating = (rating: string) => {
    const num = parseFloat(rating)
    if (isNaN(num)) return rating
    return num.toFixed(1)
  }

  return (
    <Card className="w-full border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <MapPin className="h-3 w-3 text-white" />
          </div>
          高德地图信息
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* POI基本信息 */}
        <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
          <div className="text-sm font-medium text-blue-700 mb-3 flex items-center gap-2">
            <Building className="h-4 w-4" />
            地点信息
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditableField
              label="POI ID"
              value={metadata.poi_id}
              type="text"
              editable={editable}
              onChange={(value) => handleFieldChange('poi_id', value)}
            />
            
            <EditableField
              label="地点名称"
              value={metadata.place_name}
              type="text"
              editable={editable}
              onChange={(value) => handleFieldChange('place_name', value)}
            />
          </div>
        </div>

        {/* 地址信息 */}
        <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
          <div className="text-sm font-medium text-blue-700 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            地址详情
          </div>
          <div className="space-y-4">
            <EditableField
              label="详细地址"
              value={metadata.address}
              type="textarea"
              editable={editable}
              onChange={(value) => handleFieldChange('address', value)}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EditableField
                label="省份"
                value={metadata.province}
                type="text"
                editable={editable}
                onChange={(value) => handleFieldChange('province', value)}
              />
              
              <EditableField
                label="城市"
                value={metadata.city}
                type="text"
                editable={editable}
                onChange={(value) => handleFieldChange('city', value)}
              />
              
              <EditableField
                label="区县"
                value={metadata.district}
                type="text"
                editable={editable}
                onChange={(value) => handleFieldChange('district', value)}
              />
            </div>
          </div>
        </div>

        {/* 坐标信息 */}
        <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
          <div className="text-sm font-medium text-blue-700 mb-3 flex items-center gap-2">
            <Navigation className="h-4 w-4" />
            坐标信息
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">WGS84坐标</div>
              <div className="text-sm text-blue-600 font-mono bg-blue-50 p-2 rounded border">
                {formatCoordinate(metadata.latitude, metadata.longitude)}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">高德坐标</div>
              <div className="text-sm text-blue-600 font-mono bg-blue-50 p-2 rounded border">
                {formatCoordinate(metadata.coord_y, metadata.coord_x)}
              </div>
            </div>
          </div>
        </div>

        {/* 联系方式和营业信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metadata.telephone && (
            <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
              <div className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                联系电话
              </div>
              <a 
                href={`tel:${metadata.telephone}`}
                className="text-blue-600 hover:text-blue-800 underline"
              >
                {metadata.telephone}
              </a>
            </div>
          )}
          
          {metadata.open_time && (
            <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
              <div className="text-sm font-medium text-blue-700 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                营业时间
              </div>
              <div className="text-sm text-muted-foreground">
                {metadata.open_time}
              </div>
            </div>
          )}
        </div>

        {/* 评分和类型 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metadata.rating && (
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                评分
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  {formatRating(metadata.rating)}
                </Badge>
              </div>
            </div>
          )}
          
          {metadata.poi_type && (
            <div className="space-y-2">
              <div className="text-sm font-medium">POI类型</div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                {metadata.poi_type}
              </Badge>
            </div>
          )}
        </div>

        {/* 编码信息 */}
        <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
          <div className="text-sm font-medium text-blue-700 mb-3">编码信息</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <div className="text-muted-foreground">区域编码</div>
              <div className="font-mono">{metadata.adcode || '-'}</div>
            </div>
            <div>
              <div className="text-muted-foreground">城市编码</div>
              <div className="font-mono">{metadata.citycode || '-'}</div>
            </div>
            <div>
              <div className="text-muted-foreground">类型编码</div>
              <div className="font-mono">{metadata.typecode || '-'}</div>
            </div>
            <div>
              <div className="text-muted-foreground">网格编码</div>
              <div className="font-mono">{metadata.gridcode || '-'}</div>
            </div>
          </div>
        </div>

        {/* 额外服务信息 */}
        {(metadata.cost || metadata.discount_num || metadata.groupbuy_num) && (
          <div className="bg-white/60 rounded-lg p-4 border border-blue-100">
            <div className="text-sm font-medium text-blue-700 mb-3 flex items-center gap-2">
              <Car className="h-4 w-4" />
              服务信息
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {metadata.cost && (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">费用</div>
                  <div className="text-sm">{metadata.cost}</div>
                </div>
              )}
              
              {metadata.discount_num && (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">优惠数量</div>
                  <div className="text-sm">{metadata.discount_num}</div>
                </div>
              )}
              
              {metadata.groupbuy_num && (
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">团购数量</div>
                  <div className="text-sm">{metadata.groupbuy_num}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 其他信息 */}
        {(metadata.indoor_map || metadata.meal_ordering) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metadata.indoor_map && (
              <div className="space-y-2">
                <div className="text-sm font-medium">室内地图</div>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  {metadata.indoor_map === '1' ? '支持' : '不支持'}
                </Badge>
              </div>
            )}
            
            {metadata.meal_ordering && (
              <div className="space-y-2">
                <div className="text-sm font-medium">订餐服务</div>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  {metadata.meal_ordering === '1' ? '支持' : '不支持'}
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
