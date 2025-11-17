# Users & Access Control

Comprehensive guide to user management, roles, and access control systems.

## User Roles

- **Admin**: Full control - manage users, profiles, and settings
- **Counselor**: Create and manage profiles, invite counselees, view reports
- **Counselee**: View-only access to assigned profiles, answer questions

## Access Management

### Counselee Assignment
Users are invited to specific profiles by counselors/admins. When added:
1. New user account created via magic link invitation
2. Automatic welcome email sent
3. User can only access assigned profiles
4. Access controlled via RLS policies on `profile_access` table

### User Metadata
```javascript
{
  role: 'counselee' | 'counselor' | 'admin',
  invited_for_profile: '[profile-id]',
  profile_title: 'Gospel Presentation',
  profile_slug: 'john-3-16'
}
```

## Counselor Interface

### User Dropdown
Counselors see all users in the "Select existing user..." dropdown when:
- Creating new profiles
- Adding counselees to existing profiles
- User profiles table has RLS policies allowing counselor access

### User Invitation
When adding a counselee:
1. Search for existing user or type email
2. System checks if user exists
3. If new: creates account and sends welcome email
4. If existing: adds to profile access
5. Magic link sent for setup/sign in

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Can't see users in dropdown | Verify counselor RLS policies are configured |
| Counselee can't access profile | Check `profile_access` table, verify RLS policies |
| Wrong user invited | Verify email address before confirmation |

## Related Documentation
- [SECURITY.md](SECURITY.md) - Security and RLS policies
- [WELCOME_EMAIL.md](WELCOME_EMAIL.md) - Email invitation system
- Full implementation: [COUNSELEE_SYSTEM.md](COUNSELEE_SYSTEM.md), [COUNSELOR_USER_DROPDOWN.md](COUNSELOR_USER_DROPDOWN.md)
