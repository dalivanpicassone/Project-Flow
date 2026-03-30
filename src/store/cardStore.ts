import type { Database } from "@/types/database"
import { create } from "zustand"

type Card = Database["public"]["Tables"]["cards"]["Row"]

/**
 * Глобальное хранилище карточек (Zustand).
 * Используется хуком useCards и useRealtime для синхронизации с Supabase.
 */
interface CardState {
  /** Список всех карточек текущей доски */
  cards: Card[]
  /** Флаг загрузки данных */
  isLoading: boolean
  setCards: (cards: Card[]) => void
  addCard: (card: Card) => void
  updateCard: (id: string, updates: Partial<Card>) => void
  removeCard: (id: string) => void
  setLoading: (loading: boolean) => void
}

export const useCardStore = create<CardState>((set) => ({
  cards: [],
  isLoading: false,
  setCards: (cards) => set({ cards }),
  // Добавляет карточку, избегая дубликатов (напр., если realtime-событие пришло раньше ответа)
  addCard: (card) =>
    set((state) => ({
      cards: state.cards.some((c) => c.id === card.id) ? state.cards : [...state.cards, card],
    })),
  // Обновляет карточку по id, создавая новый объект (иммютабельность)
  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  // Удаляет карточку из списка по id
  removeCard: (id) => set((state) => ({ cards: state.cards.filter((c) => c.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
}))
