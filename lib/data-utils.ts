import type { AIUpdate, NormalizedUpdate, FilterState, TrendInsight, TagStat, SourceStat, RegionStat } from "./types"

// 字段映射兼容层
function normalizeField<T>(item: Record<string, unknown>, keys: string[]): T | undefined {
  for (const key of keys) {
    if (item[key] !== undefined && item[key] !== null && item[key] !== "") {
      return item[key] as T
    }
  }
  return undefined
}

// 解析标签字符串
function parseTags(tagStr: string | undefined): string[] {
  if (!tagStr) return []
  // 支持中文顿号、逗号、分号、英文逗号分隔
  return tagStr
    .split(/[、，,;；]/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
}

// 解析日期
function parseDate(dateStr: string | undefined): Date {
  if (!dateStr) return new Date()
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? new Date() : date
}

// 计算信号强度
function calculateSignalStrength(item: NormalizedUpdate): "高" | "中" | "低" {
  const hasTrackingValue = item.trackingValue && item.trackingValue.length > 0
  const hasTags = item.tags.length >= 2

  if (hasTrackingValue && hasTags) return "高"
  if (item.summary && item.summary.length > 0) return "中"
  return "低"
}

// 规范化单条数据
export function normalizeUpdate(item: Record<string, unknown>, index: number): NormalizedUpdate {
  const title = normalizeField<string>(item, ["标题", "title"]) || ""
  const publisher = normalizeField<string>(item, ["发布方", "公司", "publisher"]) || ""
  const dateStr = normalizeField<string>(item, ["日期", "date"]) || ""
  const date = parseDate(dateStr)
  const region = (normalizeField<string>(item, ["地区", "region"]) || "海外") as "海外" | "国内"
  const type = normalizeField<string>(item, ["类型", "type"]) || ""
  const source = normalizeField<string>(item, ["来源", "source"]) || ""
  const sourceType = normalizeField<string>(item, ["来源类型", "sourceType"]) || ""
  const summary = normalizeField<string>(item, ["一句话摘要", "摘要", "summary"]) || ""
  const tagStr = normalizeField<string>(item, ["标签", "tag", "tags"]) || ""
  const tags = parseTags(tagStr)
  const trackingValue = normalizeField<string>(item, ["追踪价值总结", "trackingValue"]) || ""
  const link = normalizeField<string>(item, ["链接", "url", "link"]) || ""

  const normalized: NormalizedUpdate = {
    id: `update-${index}-${date.getTime()}`,
    title,
    publisher,
    date,
    dateStr: dateStr || date.toISOString().split("T")[0],
    region,
    type,
    source,
    sourceType,
    summary,
    tags,
    trackingValue,
    link,
    signalStrength: "低",
  }

  normalized.signalStrength = calculateSignalStrength(normalized)

  return normalized
}

// 规范化数据数组
export function normalizeData(data: AIUpdate[]): NormalizedUpdate[] {
  return data.map((item, index) => normalizeUpdate(item as unknown as Record<string, unknown>, index))
}

// 判断日期是否在范围内
function isWithinDays(date: Date, days: number): boolean {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const daysDiff = diff / (1000 * 60 * 60 * 24)
  return daysDiff <= days
}

// 筛选数据
export function filterData(data: NormalizedUpdate[], filters: FilterState): NormalizedUpdate[] {
  return data.filter((item) => {
    // 时间范围筛选
    if (filters.timeRange !== "全部") {
      const days =
        filters.timeRange === "近7天" ? 7 : filters.timeRange === "近30天" ? 30 : filters.timeRange === "近90天" ? 90 : 0
      if (!isWithinDays(item.date, days)) return false
    }

    // 地区筛选
    if (filters.region !== "全部" && item.region !== filters.region) {
      return false
    }

    // 类型筛选
    if (filters.type !== "全部" && item.type !== filters.type) {
      return false
    }

    // 来源类型筛选
    if (filters.sourceType !== "全部" && item.sourceType !== filters.sourceType) {
      return false
    }

    // 搜索筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const searchFields = [
        item.title,
        item.publisher,
        ...item.tags,
        item.summary,
        item.trackingValue,
      ].join(" ").toLowerCase()
      if (!searchFields.includes(searchLower)) {
        return false
      }
    }

    return true
  })
}

// 排序数据
export function sortData(data: NormalizedUpdate[], sortBy: FilterState["sortBy"]): NormalizedUpdate[] {
  const sorted = [...data]

  if (sortBy === "最新优先") {
    sorted.sort((a, b) => b.date.getTime() - a.date.getTime())
  } else {
    // 最重要优先：按信号强度排序，同等强度按日期排序
    const strengthOrder = { 高: 3, 中: 2, 低: 1 }
    sorted.sort((a, b) => {
      const strengthDiff = strengthOrder[b.signalStrength] - strengthOrder[a.signalStrength]
      if (strengthDiff !== 0) return strengthDiff
      return b.date.getTime() - a.date.getTime()
    })
  }

  return sorted
}

// 计算统计数据
export function calculateStats(data: NormalizedUpdate[]) {
  const last30Days = data.filter((item) => isWithinDays(item.date, 30))

  const overseasCount = last30Days.filter((item) => item.region === "海外").length
  const domesticCount = last30Days.filter((item) => item.region === "国内").length

  // 计算高频标签
  const tagCounts: Record<string, number> = {}
  last30Days.forEach((item) => {
    item.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag)

  // 计算来源覆盖数
  const uniqueSources = new Set(last30Days.map((item) => item.source))

  return {
    overseasCount,
    domesticCount,
    topTags,
    sourceCount: uniqueSources.size,
  }
}

// 生成趋势观察
export function generateTrendInsights(data: NormalizedUpdate[]): TrendInsight[] {
  if (data.length === 0) {
    return [
      {
        title: "数据不足",
        content: "当前筛选条件下暂无足够数据生成趋势分析。",
      },
    ]
  }

  const insights: TrendInsight[] = []

  // 分析类型分布
  const typeCounts: Record<string, number> = {}
  data.forEach((item) => {
    if (item.type) {
      typeCounts[item.type] = (typeCounts[item.type] || 0) + 1
    }
  })
  const topTypes = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)

  if (topTypes.length > 0) {
    const typeStr = topTypes.map(([t, c]) => `${t}(${c}条)`).join("、")
    insights.push({
      title: "动态类型集中度",
      content: `当前数据中，${typeStr}占据主导地位，反映出行业关注焦点正向产品创新和功能迭代倾斜。`,
    })
  }

  // 分析海外与国内差异
  const overseas = data.filter((item) => item.region === "海外")
  const domestic = data.filter((item) => item.region === "国内")

  if (overseas.length > 0 && domestic.length > 0) {
    const overseasTypes = [...new Set(overseas.map((i) => i.type).filter(Boolean))]
    const domesticTypes = [...new Set(domestic.map((i) => i.type).filter(Boolean))]

    insights.push({
      title: "海外与国内差异",
      content: `海外动态主要集中在${overseasTypes.slice(0, 2).join("、")}方向，而国内更关注${domesticTypes.slice(0, 2).join("、")}。这种差异反映了不同市场阶段的产品策略分化。`,
    })
  } else if (overseas.length > domestic.length) {
    insights.push({
      title: "信息来源分布",
      content: `当前数据以海外动态为主(${overseas.length}条)，表明硅谷一线 AI 产品的迭代速度和信息透明度仍处于领先地位。`,
    })
  } else {
    insights.push({
      title: "信息来源分布",
      content: `当前数据以国内动态为主(${domestic.length}条)，国内大模型厂商正在加速追赶，产品发布节奏明显加快。`,
    })
  }

  // 分析竞争趋势
  const publishers = [...new Set(data.map((item) => item.publisher).filter(Boolean))]
  const highSignalItems = data.filter((item) => item.signalStrength === "高")

  if (highSignalItems.length > 0) {
    const highSignalPublishers = [...new Set(highSignalItems.map((i) => i.publisher))]
    insights.push({
      title: "竞争格局观察",
      content: `共有 ${publishers.length} 家厂商发布动态，其中 ${highSignalPublishers.slice(0, 3).join("、")} 等的动态具有较高追踪价值，建议持续关注其产品战略走向。`,
    })
  } else {
    insights.push({
      title: "竞争格局观察",
      content: `共有 ${publishers.length} 家厂商发布动态，市场参与者众多，竞争日趋激烈。`,
    })
  }

  return insights.slice(0, 3)
}

// 计算标签统计
export function calculateTagStats(data: NormalizedUpdate[]): TagStat[] {
  const tagCounts: Record<string, number> = {}
  data.forEach((item) => {
    item.tags.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
}

// 计算来源统计
export function calculateSourceStats(data: NormalizedUpdate[]): SourceStat[] {
  const sourceCounts: Record<string, number> = {}
  data.forEach((item) => {
    if (item.sourceType) {
      sourceCounts[item.sourceType] = (sourceCounts[item.sourceType] || 0) + 1
    }
  })
  return Object.entries(sourceCounts)
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
}

// 计算地区统计
export function calculateRegionStats(data: NormalizedUpdate[]): RegionStat[] {
  const regionCounts: Record<string, number> = {}
  data.forEach((item) => {
    regionCounts[item.region] = (regionCounts[item.region] || 0) + 1
  })
  return Object.entries(regionCounts)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count)
}

// 获取本周重点观察
export function getWeeklyHighlights(data: NormalizedUpdate[]): NormalizedUpdate[] {
  const priorityTypes = ["产品发布", "Agent", "开发者工具", "企业方案"]

  const scored = data.map((item) => {
    let score = 0

    // 时间得分：越近越高
    const daysSincePost = (new Date().getTime() - item.date.getTime()) / (1000 * 60 * 60 * 24)
    score += Math.max(0, 30 - daysSincePost)

    // 海外优先
    if (item.region === "海外") score += 10

    // 类型优先
    if (priorityTypes.includes(item.type)) score += 15

    // 追踪价值优先
    if (item.trackingValue && item.trackingValue.length > 0) score += 20

    // 信号强度
    if (item.signalStrength === "高") score += 15
    else if (item.signalStrength === "中") score += 5

    return { item, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.item)
}

// 获取所有类型选项
export function getAllTypes(data: NormalizedUpdate[]): string[] {
  const types = new Set(data.map((item) => item.type).filter(Boolean))
  return Array.from(types)
}

// 获取所有来源类型选项
export function getAllSourceTypes(data: NormalizedUpdate[]): string[] {
  const sourceTypes = new Set(data.map((item) => item.sourceType).filter(Boolean))
  return Array.from(sourceTypes)
}
