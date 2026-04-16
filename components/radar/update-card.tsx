"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Calendar, Building2, MapPin, FileType, Globe } from "lucide-react"
import type { NormalizedUpdate } from "@/lib/types"

interface UpdateCardProps {
  update: NormalizedUpdate
}

export function UpdateCard({ update }: UpdateCardProps) {
  const signalColors = {
    高: "bg-signal-high text-white",
    中: "bg-signal-medium text-background",
    低: "bg-signal-low text-foreground",
  }

  return (
    <Card className="bg-card border-border hover:border-primary/30 transition-colors">
      <CardContent className="p-5">
        {/* 顶部信息行 */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-2 py-0.5 text-xs font-medium rounded ${signalColors[update.signalStrength]}`}
              >
                信号{update.signalStrength}
              </span>
              {update.region && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="w-3 h-3" />
                  {update.region}
                </span>
              )}
              {update.type && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <FileType className="w-3 h-3" />
                  {update.type}
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-foreground leading-snug text-balance">
              {update.title}
            </h3>
          </div>
        </div>

        {/* 元信息 */}
        <div className="flex flex-wrap items-center gap-3 mb-3 text-sm text-muted-foreground">
          {update.publisher && (
            <span className="flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              {update.publisher}
            </span>
          )}
          {update.dateStr && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {update.dateStr}
            </span>
          )}
          {update.source && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {update.source}
              {update.sourceType && <span className="text-xs">({update.sourceType})</span>}
            </span>
          )}
        </div>

        {/* 摘要 */}
        {update.summary && (
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{update.summary}</p>
        )}

        {/* 标签 */}
        {update.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {update.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs font-normal bg-secondary/50">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* 追踪价值总结 */}
        {update.trackingValue && (
          <div className="bg-primary/5 border border-primary/10 rounded-md p-3 mb-3">
            <p className="text-xs font-medium text-primary mb-1">追踪价值</p>
            <p className="text-sm text-foreground/90 leading-relaxed">{update.trackingValue}</p>
          </div>
        )}

        {/* 查看原文 */}
        {update.link && (
          <div className="pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="text-primary hover:text-primary/80 hover:bg-primary/10 p-0 h-auto"
              asChild
            >
              <a href={update.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                查看原文
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
