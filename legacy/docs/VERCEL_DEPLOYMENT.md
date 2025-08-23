# Vercel Deployment Guide

## Prerequisites

Before deploying to Vercel, ensure you have:
1. A Vercel account
2. A Supabase project with database configured
3. OpenAI API key (optional, for AI features)

## Environment Variables

You need to configure the following environment variables in your Vercel project settings:

### Required Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR-ANON-KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]

# Database URL for Prisma
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true&connection_limit=1
```

### Optional Variables

```bash
# OpenAI API (for AI features)
OPENAI_API_KEY=[YOUR-OPENAI-API-KEY]
OPENAI_MODEL=gpt-4o-mini

# Telegram Bot (if using Telegram integration)
BOT_TOKEN=[YOUR-TELEGRAM-BOT-TOKEN]

# Geocoding (for location services)
OPENCAGE_API_KEY=[YOUR-OPENCAGE-API-KEY]
GEOCODE_PROVIDER=opencage
```

## Deployment Steps

### 1. Configure Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your GitHub repository
3. Go to Project Settings → Environment Variables
4. Add all required environment variables

### 2. Configure Build Settings

In your Vercel project settings:
- **Framework Preset**: Next.js
- **Build Command**: `pnpm run build` (or `npm run build`)
- **Output Directory**: `.next`
- **Install Command**: `pnpm install` (or `npm install`)

### 3. Database Setup

Before deploying, ensure your Supabase database is properly configured:

```bash
# Run migrations locally first to test
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 4. Deploy

1. Push your code to the main branch
2. Vercel will automatically trigger a deployment
3. Monitor the build logs for any errors

## Common Issues and Solutions

### Issue: "Supabase URL is required" during build

**Solution**: The Supabase client initialization has been updated to handle missing environment variables during build time. Ensure you're using the latest version of `/src/lib/db/index.ts`.

### Issue: TypeScript/ESLint warnings

**Solution**: All TypeScript and ESLint warnings have been fixed. The build should complete without warnings.

### Issue: Database connection errors

**Solution**: 
1. Verify your DATABASE_URL is correct
2. Ensure your Supabase project allows connections from Vercel's IP addresses
3. Check that you're using the pooler connection string (port 6543)

### Issue: Missing dependencies

**Solution**: Ensure all dependencies are listed in `package.json` and not in `devDependencies` if they're needed for production.

## Production Checklist

- [ ] All environment variables configured in Vercel
- [ ] Database migrations applied to production database
- [ ] Supabase RLS policies configured (if using)
- [ ] API rate limiting configured (if needed)
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Analytics configured (if needed)

## Monitoring

After deployment:
1. Check the Functions tab in Vercel for API route performance
2. Monitor error logs in the Vercel dashboard
3. Test all critical user flows in production

## Support

For issues specific to:
- **Vercel**: Check [Vercel Documentation](https://vercel.com/docs)
- **Supabase**: Check [Supabase Documentation](https://supabase.com/docs)
- **Next.js**: Check [Next.js Documentation](https://nextjs.org/docs)