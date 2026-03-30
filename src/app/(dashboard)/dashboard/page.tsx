import { BoardList } from "@/components/board/BoardList"
import { CreateBoardDialog } from "@/components/board/CreateBoardDialog"
import { DashboardStats } from "@/components/dashboard/DashboardStats"

export const dynamic = "force-dynamic"
export const metadata = { title: "Мои доски — ProjectFlow" }

export default function DashboardPage() {
  return (
    <>
      {/* Topbar */}
      <div className="h-12 border-b border-[#141420] px-5 flex items-center justify-between shrink-0">
        <h1 className="text-sm font-semibold text-[#f1f5f9]">Мои доски</h1>
        <CreateBoardDialog />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-5 space-y-6">
        {/* KPI stats */}
        <DashboardStats />

        {/* Board grid */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-semibold text-[#9ca3af]">Активные доски</h2>
            <div className="flex-1 h-px bg-[#1a1a24]" />
          </div>
          <BoardList />
        </div>
      </div>
    </>
  )
}
