export interface AIUpdate {
  标题: string
  发布方: string
  日期: string
  地区: "海外" | "国内" | string
  类型: string
  来源: string
  来源类型: string
  一句话摘要: string
  标签: string
  追踪价值总结: string
  链接: string
}

export interface NormalizedUpdate {
  id: string
  title: string
  publisher: string
  date: Date
  dateStr: string
  region: "海外" | "国内"
  type: string
  source: string
  sourceType: string
  summary: string
  tags: string[]
  trackingValue: string
  link: string
  signalStrength: "高" | "中" | "低"
}

export interface FilterState {
  timeRange: "全部" | "近7天" | "近30天" | "近90天"
  region: "全部" | "海外" | "国内"
  type: string
  sourceType: string
  search: string
  sortBy: "最新优先" | "最重要优先"
}

export interface TrendInsight {
  title: string
  content: string
}

export interface TagStat {
  tag: string
  count: number
}

export interface SourceStat {
  source: string
  count: number
}

export interface RegionStat {
  region: string
  count: number
}
