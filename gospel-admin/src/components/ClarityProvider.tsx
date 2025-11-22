'use client'

import { useEffect } from 'react'

/**
 * Microsoft Clarity Provider
 * Initializes Clarity tracking for user behavior analytics
 */
export function ClarityProvider() {
  useEffect(() => {
    const projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID
    
    if (!projectId) {
      console.warn('Clarity project ID not configured')
      return
    }

    // Check if Clarity is already initialized (avoid double loading)
    if ((window as any).clarity) {
      console.log('Clarity already initialized')
      return
    }

    // Load Clarity using the standard initialization method
    ;(function(c: any, l: any, a: string, r: string, i: string, t: any, y: any) {
      c[a] = c[a] || function() {
        (c[a].q = c[a].q || []).push(arguments)
      }
      t = l.createElement(r)
      t.async = 1
      t.src = 'https://www.clarity.ms/tag/' + i
      y = l.getElementsByTagName(r)[0]
      y.parentNode.insertBefore(t, y)
    })(window, document, 'clarity', 'script', projectId)
    
    console.log('Clarity initialized with project ID:', projectId)
  }, [])

  return null
}
