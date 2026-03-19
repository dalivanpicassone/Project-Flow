import type { Database } from "@/types/database"
import { create } from "zustand"

type Column = Database["public"]["Tables"]["columns"]["Row"]

interface ColumnState {
  columns: Column[]
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
  addColumn: (column) => set((state) => ({
    columns: state.columns.some((c) => c.id === column.id)
      ? state.columns
      : [...state.columns, column],
  })),
  updateColumn: (id, updates) =>
    set((state) => ({
      columns: state.columns.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  removeColumn: (id) => set((state) => ({ columns: state.columns.filter((c) => c.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
}))
