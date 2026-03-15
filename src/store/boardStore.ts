import type { Database } from "@/types/database"
import { create } from "zustand"

type Board = Database["public"]["Tables"]["boards"]["Row"]

interface BoardState {
  boards: Board[]
  activeBoard: Board | null
  isLoading: boolean
  setBoards: (boards: Board[]) => void
  setActiveBoard: (board: Board | null) => void
  addBoard: (board: Board) => void
  updateBoard: (id: string, updates: Partial<Board>) => void
  removeBoard: (id: string) => void
  setLoading: (loading: boolean) => void
}

export const useBoardStore = create<BoardState>((set) => ({
  boards: [],
  activeBoard: null,
  isLoading: false,
  setBoards: (boards) => set({ boards }),
  setActiveBoard: (board) => set({ activeBoard: board }),
  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
  updateBoard: (id, updates) =>
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),
  removeBoard: (id) => set((state) => ({ boards: state.boards.filter((b) => b.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
}))
