"use client";

import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * true somente depois da hidratação no cliente.
 * Padrão recomendado pelo React — evita setState dentro de useEffect
 * (que dispara renderizações em cascata).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
