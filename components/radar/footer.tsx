"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border mt-12 pt-8 pb-8">
      <div className="container mx-auto px-4">
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Info className="w-4 h-4 text-muted-foreground" />
              关于本工具
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              本工具聚焦国内外 AI 产品动态追踪，重点关注海外一线产品发布、功能更新、开发者工具与产品方向变化。当前版本为用于展示核心思路的 MVP，采用公开信息进行结构化整理与展示，并基于筛选结果自动生成简要趋势观察。
            </p>
          </CardContent>
        </Card>
        <div className="text-center text-xs text-muted-foreground mt-6">
          AI动态追踪雷达 · MVP Demo
        </div>
      </div>
    </footer>
  )
}
