"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Globe, MapPin, Tag, Database } from "lucide-react"

interface MetricCardsProps {
  overseasCount: number
  domesticCount: number
  topTags: string[]
  sourceCount: number
}

export function MetricCards({ overseasCount, domesticCount, topTags, sourceCount }: MetricCardsProps) {
  const metrics = [
    {
      label: "近30天海外动态",
      value: overseasCount,
      icon: Globe,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "近30天国内动态",
      value: domesticCount,
      icon: MapPin,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "近30天高频标签",
      value: topTags.length > 0 ? topTags.join("、") : "暂无",
      icon: Tag,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
      isText: true,
    },
    {
      label: "重点来源覆盖数",
      value: sourceCount,
      icon: Database,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.label} className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                {metric.isText ? (
                  <p className="text-base font-medium text-foreground truncate" title={String(metric.value)}>
                    {metric.value}
                  </p>
                ) : (
                  <p className="text-2xl font-semibold text-foreground">{metric.value}</p>
                )}
              </div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
