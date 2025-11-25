'use client'

import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 600

/**
 * Hook to detect mobile viewport without causing layout thrashing.
 * Uses resize event listener instead of checking window.innerWidth on every frame.
 */
export function useMobileCheck(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    // SSR-safe initial value
    if (typeof window === 'undefined') return false
    return window.innerWidth < breakpoint
  })

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Check immediately in case initial value was wrong (SSR)
    checkMobile()

    // Use resize observer for better performance than resize event
    window.addEventListener('resize', checkMobile, { passive: true })
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [breakpoint])

  return isMobile
}

