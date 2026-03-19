import type { Database } from "@/types/database"
import { create } from "zustand"

type Card = Database["public"]["Tables"]["cards"]["Row"]

interface CardState {
  cards: Card[]
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
  addCard: (card) => set((state) => ({
    cards: state.cards.some((c) => c.id === card.id)
      ? state.cards
      : [...state.cards, card],
  })),
  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),
  removeCard: (id) => set((state) => ({ cards: state.cards.filter((c) => c.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
}))
