'use client'

import { ReactNode } from 'react'
import { r3f } from '@/helpers/global'

export const Three = ({ children }: { children: ReactNode }) => {
  return <r3f.In>{children}</r3f.In>
}
