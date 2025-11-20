'use client'

import { ReactNode } from 'react'
import { ui } from '@/helpers/global'

export const Ui = ({ children }: { children: ReactNode }) => {
  return <ui.In>{children}</ui.In>
}
