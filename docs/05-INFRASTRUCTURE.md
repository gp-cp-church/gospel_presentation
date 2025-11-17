# Infrastructure & Deployment

Database setup, security, and deployment information.

## Supabase Database

Complete migration from Netlify + Simple Auth to Supabase PostgreSQL with multi-user authentication.

### Key Tables
- **auth.users** - Authentication users (Supabase managed)
- **user_profiles** - User metadata (role, username, etc.)
- **profiles** - Gospel presentation resources
- **profile_access** - Counselee access assignments
- **user_answers** - Stored user responses
- **coma_templates** - COMA method templates
- **bible_verses** - KJV and other translations
- **scripture_cache** - ESV API response cache

### Row-Level Security (RLS)
All tables protected with RLS policies:
- Public users see only public profiles
- Counselees see only assigned profiles
- Counselors manage own profiles
- Admins have full access
- Email templates visible to admins only

**Setup**: See [SUPABASE_MIGRATION.md](SUPABASE_MIGRATION.md)

## Security Guidelines

### Core Security Features
- Row-Level Security on all data tables
- Magic link authentication (no passwords)
- Session management with expiry
- User role-based access control
- Admin-only operations protected
- Service role key for admin operations

### Best Practices
- Never commit `.env.local` with real keys
- Use environment variables for all secrets
- Verify user role before operations
- Check RLS policies regularly
- Monitor Supabase logs for unauthorized access

### Database Access Control
- Anonymous users: Read-only public profiles
- Authenticated users: Role-based via RLS
- Admins: Use service role key for server operations
- All client operations: User's current session

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Build successful
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Supabase RLS policies verified

### Production Setup
- [ ] Supabase production project created
- [ ] Custom SMTP configured (email)
- [ ] Magic link redirect URLs added
- [ ] Environment variables deployed
- [ ] Backup system tested
- [ ] Monitoring configured

### Post-Deployment Verification
- [ ] Health checks passing
- [ ] User authentication working
- [ ] Email invitations functional
- [ ] Scripture lookups working
- [ ] Admin features accessible

## Backups & Recovery

### Manual Backup
```bash
cd gospel-admin
node scripts/backup-database.js
```

### Restore Backup
```bash
node scripts/restore-backup.js
```

### Recovery Steps
1. Export backup from production
2. Verify backup integrity
3. Restore to test environment
4. Verify all data present
5. Promote to production if needed

## Testing

**Status**: 476 tests passing, 28 skipped, 0 failures

### Run Tests
```bash
cd gospel-admin
npm test
```

### Test Coverage
- React components
- API routes and endpoints
- User interactions
- Admin functionality
- Authentication flows

## Related Documentation
- Full Supabase setup: [SUPABASE_MIGRATION.md](SUPABASE_MIGRATION.md)
- Security policies: [SECURITY.md](SECURITY.md)
- KJV database: [KJV_DATABASE.md](KJV_DATABASE.md)
- Testing: [TEST_SUITE_README.md](TEST_SUITE_README.md)
