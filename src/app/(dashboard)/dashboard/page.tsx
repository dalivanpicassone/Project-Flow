import { BoardList } from "@/components/board/BoardList"
import { CreateBoardDialog } from "@/components/board/CreateBoardDialog"
import { DashboardStats } from "@/components/dashboard/DashboardStats"

export const dynamic = "force-dynamic"
export const metadata = { title: "Мои доски — Agora" }

export default function DashboardPage() {
  return (
    <>
      {/* Topbar */}
      <div className="h-14 border-b border-border px-6 flex items-center justify-between shrink-0">
        <h1 className="text-sm font-bold text-foreground tracking-[-0.01em]">Мои доски</h1>
        <CreateBoardDialog />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* KPI stats */}
        <DashboardStats />

        {/* Board grid */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-[0.06em]">Активные доски</h2>
            <div className="flex-1 h-px bg-border/60" />
          </div>
          <BoardList />
        </div>
      </div>
    </>
  )
}
