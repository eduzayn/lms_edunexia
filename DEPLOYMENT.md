# Edunexia LMS - Deployment Guide

This guide provides instructions for deploying the Edunexia LMS platform to Vercel.

## Prerequisites

Before deploying, ensure you have:

1. A Vercel account
2. Access to the GitHub repository
3. Supabase project with necessary tables and configurations
4. Required API keys for third-party services

## Environment Variables

The following environment variables need to be configured in Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ACCESS_TOKEN=your_supabase_access_token
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
LYTEX_API_KEY=your_lytex_api_key
LYTEX_API_URL=your_lytex_api_url
INFINITYPAY_API_KEY=your_infinitypay_api_key
INFINITYPAY_API_URL=your_infinitypay_api_url
```

## Deployment Steps

### 1. Connect to GitHub Repository

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Select the GitHub repository "eduzayn/lms_edunexia"
4. Click "Import"

### 2. Configure Project

1. Select the appropriate framework preset (Next.js)
2. Set the build command: `npm run build`
3. Set the output directory: `.next`
4. Configure environment variables (see above)
5. Click "Deploy"

### 3. Verify Deployment

1. Wait for the deployment to complete
2. Click on the generated URL to access your application
3. Verify that all features are working correctly

## Continuous Deployment

Vercel automatically deploys changes when new commits are pushed to the main branch. To manually trigger a deployment:

1. Go to the project dashboard in Vercel
2. Click "Deployments"
3. Click "Redeploy" on the deployment you want to rebuild

## Troubleshooting

If you encounter issues during deployment:

1. Check the build logs for errors
2. Verify that all environment variables are correctly set
3. Ensure that the Supabase project is properly configured
4. Check that all API keys are valid and have the necessary permissions

## Custom Domains

To configure a custom domain:

1. Go to the project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow the instructions to verify domain ownership and configure DNS settings
