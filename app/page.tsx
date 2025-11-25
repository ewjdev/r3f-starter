'use client'

import { Three } from '@/helpers/components/Three'
import Loading from '@/components/canvas/Loading'
import { Suspense } from 'react'
import HomeScene from '@/components/canvas/HomeScene'
import { useAppStore, useHydration } from '@/store'
import HomeSelection from '@/components/dom/HomeSelection'
import Home2D from '@/components/dom/Home2D'

export default function Page() {
  const viewMode = useAppStore((state) => state.viewMode)
  const hydrated = useHydration()

  // Wait for hydration before rendering view-mode-dependent content
  if (!hydrated) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <div className='animate-pulse text-white/50'>Loading...</div>
      </div>
    )
  }

  // Show selection screen if user hasn't chosen a mode yet
  if (viewMode === null) {
    return <HomeSelection />
  }

  // Show 2D home page
  if (viewMode === '2d') {
    return <Home2D />
  }

  // Show 3D home page (default/existing behavior)
  return (
    <div>
      {/* 
        The 3D scene is tunneled into the shared Canvas via <Three>.
        This allows the Canvas to persist across page navigations.
      */}
      <Loading />
      <Three>
        <Suspense>
          <HomeScene />
        </Suspense>
      </Three>
    </div>
  )
}
