import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { getTotalEsvCacheVerseCount } from '@/lib/verse-counter'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get all cache entries for ESV
    const { data, error } = await supabase
      .from('scripture_cache')
      .select('reference')
      .eq('translation', 'esv')

    if (error) {
      logger.error('Error counting ESV cache:', error)
      return NextResponse.json({ error: 'Failed to count cache', count: 0, totalVerses: 0 }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ count: 0, totalVerses: 0, verseLimit: 500, withinLimit: true })
    }

    // Count unique references
    const uniqueReferences = new Set<string>()
    data.forEach((entry: { reference: string }) => {
      if (entry.reference) {
        uniqueReferences.add(entry.reference)
      }
    })

    // Get total verse count using shared utility
    const totalVerses = await getTotalEsvCacheVerseCount(supabase)

    return NextResponse.json({ 
      count: uniqueReferences.size,
      totalVerses,
      verseLimit: 500,
      withinLimit: totalVerses <= 500
    })
  } catch (error) {
    logger.error('ESV cache count error:', error)
    return NextResponse.json({ error: 'Internal server error', count: 0, totalVerses: 0 }, { status: 500 })
  }
}
