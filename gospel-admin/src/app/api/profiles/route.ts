import { NextResponse } from 'next/server'
import { getProfiles, createProfile } from '@/lib/supabase-data-service'
import { createClient } from '@/lib/supabase/server'
import type { CreateProfileRequest, GospelProfile } from '@/lib/types'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    logger.debug('[API] GET /api/profiles - loading from supabase-data-service')
    
    const profiles = await getProfiles()
    const supabase = await createClient()

    // Fetch usernames for all counselees and owners
    const usernameMap = new Map<string, string>()
    const allUserIds = new Set<string>()
    
    // Collect all user IDs (from createdBy field for owners)
    profiles.forEach((p: any) => {
      if (p.createdBy) {
        allUserIds.add(p.createdBy)
      }
    })
    
    // Also collect user IDs from profile access (for counselees)
    // Note: profile_access stores user_email, so we need to look up the ID first
    const allCounseleeEmails = new Set(
      profiles.flatMap((p: any) => p.counseleeEmails || [])
    )

    if (allUserIds.size > 0 || allCounseleeEmails.size > 0) {
      // First get usernames for owners by ID
      if (allUserIds.size > 0) {
        const { data: userProfiles } = await supabase
          .from('user_profiles')
          .select('id, username')
          .in('id', Array.from(allUserIds))

        if (userProfiles) {
          userProfiles.forEach((up: any) => {
            usernameMap.set(up.id, up.username || '')
          })
        }
      }
      
      // Then get usernames for counselees by email
      if (allCounseleeEmails.size > 0) {
        const { data: userProfiles, error } = await supabase
          .from('user_profiles')
          .select('email, username')
          .in('email', Array.from(allCounseleeEmails))

        if (error) {
          logger.error('[API] Error fetching usernames:', error)
        }

        if (userProfiles) {
          userProfiles.forEach((up: any) => {
            if (up.email && up.username) {
              usernameMap.set(up.email, up.username)
            }
          })
        }
      }
    }
    
    // Convert to simplified format for the admin dashboard
    const profileList = profiles.map((p: GospelProfile) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      isDefault: p.isDefault,
      isTemplate: p.isTemplate,
      visitCount: p.visitCount,
      lastVisited: p.lastVisited ? (p.lastVisited instanceof Date ? p.lastVisited.toISOString() : p.lastVisited) : undefined,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      createdBy: p.createdBy,
      ownerDisplayName: p.ownerDisplayName,
      ownerUsername: p.createdBy ? (usernameMap.get(p.createdBy) || p.ownerDisplayName) : undefined,
      counseleeEmails: (p as any).counseleeEmails || [],
      usernames: ((p as any).counseleeEmails || [])
        .map((email: string) => usernameMap.get(email))
        .filter((username: string | undefined) => username)
    }))
    
    return NextResponse.json({ profiles: profileList })
  } catch (error) {
    logger.error('[API] GET /api/profiles error:', error)
    return NextResponse.json(
      { error: 'Failed to load profiles' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    logger.debug('[API] POST /api/profiles - creating new profile with persistence')
    
    const body = await request.json() as CreateProfileRequest
    
    // Validate required fields (slug is optional, will be auto-generated if not provided)
    if (!body.title) {
      return NextResponse.json(
        { error: 'Missing required field: title' },
        { status: 400 }
      )
    }
    
    // Create the profile in Supabase (slug will be auto-generated if not provided)
    const newProfile = await createProfile(body)
    
    logger.debug('[API] POST /api/profiles - profile created and saved:', newProfile.slug)
    
    return NextResponse.json({ 
      profile: {
        id: newProfile.id,
        slug: newProfile.slug,
        title: newProfile.title,
        description: newProfile.description,
        isDefault: newProfile.isDefault,
        visitCount: newProfile.visitCount,
        createdAt: newProfile.createdAt.toISOString(),
        updatedAt: newProfile.updatedAt.toISOString()
      },
      message: 'Profile created successfully' 
    })
    
  } catch (error: any) {
    console.error('[API] POST /api/profiles error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create profile' },
      { status: 500 }
    )
  }
}