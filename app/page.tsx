'use client'

import dynamic from 'next/dynamic'
import { Three } from '@/helpers/components/Three'
import Loading from '@/components/canvas/Loading'
import { Suspense } from 'react'

const HomeScene = dynamic(() => import('@/components/canvas/HomeScene'), { ssr: false })

export default function Page() {
  return (
    <div>
      <Suspense
        fallback={
          <div className='w-full h-full text-4xl bg-black text-white flex items-center justify-center'>Loading...</div>
        }
      >
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
      </Suspense>
    </div>
  )
}
