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
}))
