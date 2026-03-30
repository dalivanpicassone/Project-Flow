import type { Database } from "@/types/database"
import { create } from "zustand"

type Column = Database["public"]["Tables"]["columns"]["Row"]

/**
 * Глобальное хранилище колонок (Zustand).
 * Используется хуками useColumns и useRealtime для синхронизации с Supabase.
 */
interface ColumnState {
  /** Список колонок текущей доски, отсортированных по position */
  columns: Column[]
  /** Флаг загрузки данных */
  isLoading: boolean
  setColumns: (columns: Column[]) => void
  addColumn: (column: Column) => void
  updateColumn: (id: string, updates: Partial<Column>) => void
  removeColumn: (id: string) => void
  setLoading: (loading: boolean) => void
}

export const useColumnStore = create<ColumnState>((set) => ({
  columns: [],
  isLoading: false,
  setColumns: (columns) => set({ columns }),
  // Добавляет колонку, избегая дубликатов (напр., если realtime-событие пришло раньше ответа)
  addColumn: (column) =>
    set((state) => ({
      columns: state.columns.some((c) => c.id === column.id)
        ? state.columns
        : [...state.columns, column],
    })),
  // Обновляет колонку по id, создавая новый объект (иммютабельность)
  updateColumn: (id, updates) =>
    set((state) => ({
      columns: state.columns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  // Удаляет колонку из списка по id
  removeColumn: (id) => set((state) => ({ columns: state.columns.filter((c) => c.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
}))
