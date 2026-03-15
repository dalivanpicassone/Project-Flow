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
  addCard: (card) => set((state) => ({ cards: [...state.cards, card] })),
  updateCard: (id, updates) =>
    set((state) => ({
      cards: state.cards.map((card) => (card.id === id ? { ...card, ...updates } : card)),
    })),
  removeCard: (id) => set((state) => ({ cards: state.cards.filter((card) => card.id !== id) })),
  setLoading: (isLoading) => set({ isLoading }),
}))
