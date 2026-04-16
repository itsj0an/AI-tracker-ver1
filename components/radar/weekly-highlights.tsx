"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, ExternalLink, MapPin, FileType } from "lucide-react"
import type { NormalizedUpdate } from "@/lib/types"

interface WeeklyHighlightsProps {
  highlights: NormalizedUpdate[]
}

export function WeeklyHighlights({ highlights }: WeeklyHighlightsProps) {
  if (highlights.length === 0) return null

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="w-5 h-5 text-primary fill-primary/20" />
          本周重点观察
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {highlights.map((item, index) => (
          <div
            key={item.id}
            className="bg-card/50 rounded-lg p-4 border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {item.region && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {item.region}
                    </span>
                  )}
                  {item.type && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <FileType className="w-3 h-3" />
                      {item.type}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{item.dateStr}</span>
                </div>
                <h4 className="font-medium text-foreground mb-2 leading-snug text-balance">
                  {item.title}
                </h4>
                {item.publisher && (
                  <p className="text-sm text-muted-foreground mb-2">{item.publisher}</p>
                )}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-normal bg-secondary/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                {item.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary/80 hover:bg-primary/10 p-0 h-auto text-xs"
                    asChild
                  >
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      查看详情
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
