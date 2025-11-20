'use client'

import dynamic from 'next/dynamic'
import { Three } from '@/helpers/components/Three'

const HomeScene = dynamic(() => import('@/components/canvas/HomeScene'), { ssr: false })

export default function Page() {
  return (
    <div>
      {/* 
        The 3D scene is tunneled into the shared Canvas via <Three>.
        This allows the Canvas to persist across page navigations.
      */}
      <Three>
        <HomeScene />
      </Three>
    </div>
  )
}
