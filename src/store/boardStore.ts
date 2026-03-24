import type { Database } from "@/types/database"
import { create } from "zustand"

type Board = Database["public"]["Tables"]["boards"]["Row"]

/**
 * Глобальное хранилище досок пользователя (Zustand).
 * Используется хуком useBoards для синхронизации с Supabase.
 */
interface BoardState {
  /** Список досок текущего пользователя */
  boards: Board[]
  /** Активная доска, выбранная в данный момент */
  activeBoard: Board | null
  /** Флаг загрузки данных */
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
  // Добавляет доску в конец списка
  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
  // Обновляет доску по id, создавая новый объект (иммютабельность)
  updateBoard: (id, updates) =>
    set((state) => ({
      boards: state.boards.map((b) => (b.id === id ? { ...b, ...updates } : b)),
    })),
  // Удаляет доску из списка по id
  removeBoard: (id) => set((state) => ({ boards: state.boards.filter((b) => b.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
}))
