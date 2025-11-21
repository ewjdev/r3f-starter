import { Three } from '@/helpers/components/Three'
import Loading from '@/components/canvas/Loading'
import { Suspense } from 'react'

import HomeScene from '@/components/canvas/HomeScene'

export default function Page() {
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
