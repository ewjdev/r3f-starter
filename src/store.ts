import { create } from 'zustand'

type TransitionState = 'idle' | 'out' | 'in'

interface AppState {
  transitionState: TransitionState
  targetLetter: string | null
  startTransition: (letter: string) => void
  endTransition: () => void
  resetTransition: () => void
}

export const useAppStore = create<AppState>((set) => ({
  transitionState: 'idle',
  targetLetter: null,
  startTransition: (letter) => set({ transitionState: 'out', targetLetter: letter }),
  endTransition: () => set({ transitionState: 'in' }),
  resetTransition: () => set({ transitionState: 'idle', targetLetter: null }),
}))
