"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { FilterState } from "@/lib/types"

interface FilterBarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  typeOptions: string[]
  sourceTypeOptions: string[]
}

export function FilterBar({ filters, onFiltersChange, typeOptions, sourceTypeOptions }: FilterBarProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* 时间范围 */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">时间范围</label>
          <Select value={filters.timeRange} onValueChange={(v) => handleChange("timeRange", v)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全部">全部</SelectItem>
              <SelectItem value="近7天">近7天</SelectItem>
              <SelectItem value="近30天">近30天</SelectItem>
              <SelectItem value="近90天">近90天</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 地区 */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">地区</label>
          <Select value={filters.region} onValueChange={(v) => handleChange("region", v)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全部">全部</SelectItem>
              <SelectItem value="海外">海外</SelectItem>
              <SelectItem value="国内">国内</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 类型 */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">类型</label>
          <Select value={filters.type} onValueChange={(v) => handleChange("type", v)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全部">全部</SelectItem>
              {typeOptions.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 来源类型 */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">来源类型</label>
          <Select value={filters.sourceType} onValueChange={(v) => handleChange("sourceType", v)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="全部">全部</SelectItem>
              {sourceTypeOptions.map((sourceType) => (
                <SelectItem key={sourceType} value={sourceType}>
                  {sourceType}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 排序 */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">排序</label>
          <Select value={filters.sortBy} onValueChange={(v) => handleChange("sortBy", v)}>
            <SelectTrigger className="bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="最新优先">最新优先</SelectItem>
              <SelectItem value="最重要优先">最重要优先</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 搜索 */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">搜索</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="标题、发布方、标签..."
              value={filters.search}
              onChange={(e) => handleChange("search", e.target.value)}
              className="pl-9 bg-input border-border"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
