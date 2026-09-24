"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Unit } from "@/lib/schemas";

export type QuoteItem = {
  productSlug: string;
  variantLabel?: string | null;
  quantity?: number | null;
  unit?: Unit | null;
  unknownSpec: boolean;
};

type QuoteState = {
  items: QuoteItem[];
  segment: string | null;
  hydrated: boolean;
  add: (item: QuoteItem) => void;
  remove: (productSlug: string, variantLabel?: string | null) => void;
  update: (productSlug: string, patch: Partial<QuoteItem>, variantLabel?: string | null) => void;
  setSegment: (segment: string | null) => void;
  has: (productSlug: string) => boolean;
  clear: () => void;
};

const sameItem = (a: QuoteItem, slug: string, variant?: string | null) =>
  a.productSlug === slug && (a.variantLabel ?? null) === (variant ?? null);

export const useQuote = create<QuoteState>()(
  persist(
    (set, get) => ({
      items: [],
      segment: null,
      hydrated: false,

      add: (item) =>
        set((state) => {
          const exists = state.items.some((i) =>
            sameItem(i, item.productSlug, item.variantLabel),
          );
          if (exists) return state;
          return { items: [...state.items, item] };
        }),

      remove: (productSlug, variantLabel) =>
        set((state) => ({
          items: state.items.filter((i) => !sameItem(i, productSlug, variantLabel)),
        })),

      update: (productSlug, patch, variantLabel) =>
        set((state) => ({
          items: state.items.map((i) =>
            sameItem(i, productSlug, variantLabel) ? { ...i, ...patch } : i,
          ),
        })),

      setSegment: (segment) => set({ segment }),

      has: (productSlug) => get().items.some((i) => i.productSlug === productSlug),

      // clear() SÓ pode ser chamado após confirmação 201 do servidor.
      clear: () => set({ items: [] }),
    }),
    {
      name: "gama-quote-v1",
      partialize: (s) => ({ items: s.items, segment: s.segment }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);
