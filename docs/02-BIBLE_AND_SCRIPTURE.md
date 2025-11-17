# Bible & Scripture System

Complete guide to Bible translations, caching, and scripture retrieval.

## Supported Translations

| Translation | Source | Notes |
|-------------|--------|-------|
| **ESV** | ESV API | Cached in database, free tier available |
| **KJV** | Local Database | 31,102 verses, no API limit |
| **NASB** | API.Bible (optional) | External API, can be cached |

## KJV Implementation

KJV is stored in local Supabase database with:
- **31,102 verses** imported from scrollmapper/bible_databases (MIT licensed)
- **0 API calls needed** - completely offline capable
- **Fast lookups** - no external network latency
- **No rate limits** - unlimited access

### Setup
```bash
# Create table
# Copy gospel-admin/sql/create_bible_verses_table.sql to Supabase SQL Editor

# Import data
cd gospel-admin
node scripts/import-kjv-bible.js
```

### Book Name Normalization
Database uses: `I Samuel`, `II Samuel`, `Revelation of John`
Input converts automatically: `1 Samuel` → `I Samuel`

## ESV Caching System

ESV API responses are cached in the `scripture_cache` table to:
- Reduce API calls and costs
- Stay within free tier rate limits
- Speed up repeated requests
- Handle offline scenarios

**Cache expires**: Configurable (typically 30 days)

## Scripture API

### Endpoint
```
GET /api/scripture?reference=John%203:16&translation=esv
```

### Response
```json
{
  "reference": "John 3:16",
  "text": "[16] For God so loved the world...",
  "translation": "esv",
  "cached": false
}
```

### How It Works
1. Check local database (KJV) or cache (ESV)
2. If found → Return cached result
3. If not found → Call external API
4. Cache result → Return to user

## Adding Translations

To add a new translation (NASB, NIV, etc.):
1. Acquire licensed data (if required)
2. Create import script following KJV pattern
3. Store in database
4. Update scripture API logic
5. Configure in translation settings

## Performance

- **KJV lookup**: <5ms (local database)
- **Cached ESV**: <10ms (local database)
- **Fresh ESV**: 500-2000ms (external API)

## Related Documentation
- Full KJV details: [KJV_DATABASE.md](KJV_DATABASE.md)
- Caching details: [SCRIPTURE_CACHING.md](SCRIPTURE_CACHING.md)
- Translation setup: [BIBLE_TRANSLATION_FEATURE.md](BIBLE_TRANSLATION_FEATURE.md)
- API removal notes: [API_BIBLE_REMOVAL_COMPLETE.md](API_BIBLE_REMOVAL_COMPLETE.md)
