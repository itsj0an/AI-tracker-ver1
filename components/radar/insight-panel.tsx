"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Tag, Globe, MapPin } from "lucide-react"
import type { TrendInsight, TagStat, SourceStat, RegionStat } from "@/lib/types"

interface InsightPanelProps {
  insights: TrendInsight[]
  tagStats: TagStat[]
  sourceStats: SourceStat[]
  regionStats: RegionStat[]
}

export function InsightPanel({ insights, tagStats, sourceStats, regionStats }: InsightPanelProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        趋势观察
      </h2>

      {/* 趋势分析 */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">智能分析</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {insights.map((insight, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-medium text-foreground">{insight.title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{insight.content}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 热门标签 */}
      {tagStats.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Tag className="w-4 h-4" />
              热门标签
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tagStats.map((stat) => (
                <Badge key={stat.tag} variant="secondary" className="text-xs bg-secondary/50">
                  {stat.tag}
                  <span className="ml-1 text-muted-foreground">({stat.count})</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 来源分布 */}
      {sourceStats.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Globe className="w-4 h-4" />
              来源分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sourceStats.map((stat) => {
                const total = sourceStats.reduce((acc, s) => acc + s.count, 0)
                const percentage = Math.round((stat.count / total) * 100)
                return (
                  <div key={stat.source} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{stat.source}</span>
                      <span className="text-muted-foreground">{stat.count}条 ({percentage}%)</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 地区分布 */}
      {regionStats.length > 0 && (
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              地区分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {regionStats.map((stat) => {
                const total = regionStats.reduce((acc, s) => acc + s.count, 0)
                const percentage = Math.round((stat.count / total) * 100)
                return (
                  <div key={stat.region} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{stat.region}</span>
                      <span className="text-muted-foreground">{stat.count}条 ({percentage}%)</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-chart-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
