"use client"

import { Radar } from "lucide-react"

interface HeaderProps {
  lastUpdated: string
}

export function Header({ lastUpdated }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Radar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">AI动态追踪雷达</h1>
              <p className="text-sm text-muted-foreground">
                持续追踪国内外 AI 产品动态，重点关注海外一线产品发布、功能更新与趋势变化
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>最近更新：</span>
            <span className="text-foreground font-medium">{lastUpdated}</span>
          </div>
        </div>
      </div>
    </header>
  )
}
