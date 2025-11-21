import { create } from 'zustand'

type TransitionState = 'idle' | 'out' | 'in'

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
}

export const useAppStore = create<AppState>((set) => ({
  mode: 'dark',
  transitionState: 'idle',
  targetLetter: null,
  startTransition: (letter: string) => {
    set({ transitionState: 'out', targetLetter: letter })
  },
  endTransition: () => set({ transitionState: 'in' }),
  resetTransition: () => set({ transitionState: 'idle', targetLetter: null }),
  setMode: (mode: 'light' | 'dark') => set({ mode }),
  isNavOpen: false,
  setNavOpen: (isOpen: boolean) => set({ isNavOpen: isOpen }),
  activeSlug: null,
  setActiveSlug: (slug: string | null) => set({ activeSlug: slug }),
}))
