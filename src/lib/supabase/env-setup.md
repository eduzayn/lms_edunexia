# Environment Variables Setup

To properly configure the Supabase integration, you need to set the following environment variables:

## Required Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://uasnyifizdjxogowijip.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Vercel Configuration

When deploying to Vercel, add these environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each of the required environment variables
4. Redeploy your application

## Local Development

For local development, create a `.env.local` file in the root directory with the required environment variables.

## Important Security Note

Never commit sensitive keys to your repository. Always use environment variables for API keys and secrets.
