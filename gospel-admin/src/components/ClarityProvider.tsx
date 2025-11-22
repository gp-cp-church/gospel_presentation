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

    // Initialize Microsoft Clarity
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = `https://www.clarity.ms/tag/${projectId}`
    
    script.onload = () => {
      console.log('Clarity loaded successfully with project ID:', projectId)
    }
    
    script.onerror = () => {
      console.error('Failed to load Clarity script')
    }
    
    document.head.appendChild(script)
  }, [])

  return null
}
