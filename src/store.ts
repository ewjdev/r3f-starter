import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useEffect, useState } from 'react'

type TransitionState = 'idle' | 'out' | 'in'
type ViewMode = '3d' | '2d' | null

interface AppState {
  transitionState: TransitionState
  targetLetter: string | null
  startTransition: (letter: string) => void
  endTransition: () => void
  resetTransition: () => void
  mode: 'light' | 'dark'
  setMode: (mode: 'light' | 'dark') => void
  isNavOpen: boolean
  setNavOpen: (isOpen: boolean) => void
  activeSlug: string | null
  setActiveSlug: (slug: string | null) => void
  customBackAction: (() => void) | null
  setCustomBackAction: (action: (() => void) | null) => void
  viewMode: ViewMode
  setViewMode: (viewMode: ViewMode) => void
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      mode: 'dark',
      transitionState: 'idle',
      targetLetter: null,
      viewMode: null,
      _hasHydrated: false,
      isNavOpen: false,
      setNavOpen: (isOpen: boolean) => set({ isNavOpen: isOpen }),
      activeSlug: null,
      setActiveSlug: (slug: string | null) => set({ activeSlug: slug }),
      customBackAction: null,
      setCustomBackAction: (action) => set({ customBackAction: action }),
      startTransition: (letter: string) => {
        set({ transitionState: 'out', targetLetter: letter })
      },
      endTransition: () => set({ transitionState: 'in' }),
      resetTransition: () => set({ transitionState: 'idle', targetLetter: null }),
      setMode: (mode: 'light' | 'dark') => set({ mode }),
      setViewMode: (viewMode: ViewMode) => set({ viewMode }),
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ viewMode: state.viewMode, mode: state.mode }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

// Hook to safely use store after hydration
export function useHydration() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // Wait for next tick to ensure store is hydrated
    const unsubFinishHydration = useAppStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })

    // Check if already hydrated
    if (useAppStore.persist.hasHydrated()) {
      setHydrated(true)
    }

    return () => {
      unsubFinishHydration()
    }
  }, [])

  return hydrated
}
