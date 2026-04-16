"use client"

import { UpdateCard } from "./update-card"
import { Empty } from "@/components/ui/empty"
import { FileSearch } from "lucide-react"
import type { NormalizedUpdate } from "@/lib/types"

interface UpdateListProps {
  updates: NormalizedUpdate[]
}

export function UpdateList({ updates }: UpdateListProps) {
  if (updates.length === 0) {
    return (
      <Empty
        icon={FileSearch}
        title="暂无匹配动态"
        description="当前筛选条件下暂无匹配动态，请尝试调整时间范围、地区或关键词。"
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">动态信息流</h2>
        <span className="text-sm text-muted-foreground">共 {updates.length} 条</span>
      </div>
      <div className="space-y-3">
        {updates.map((update) => (
          <UpdateCard key={update.id} update={update} />
        ))}
      </div>
    </div>
  )
}
