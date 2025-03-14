# Edunexia LMS - Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Edunexia LMS platform to Vercel using GitHub integration.

## Prerequisites

Before deploying, ensure you have:

1. A Vercel account (sign up at https://vercel.com if needed)
2. Access to the GitHub repository (https://github.com/eduzayn/lms_edunexia)
3. Supabase project with necessary tables and configurations
4. Required API keys for third-party services

## Deployment Steps

### 1. Connect GitHub Repository to Vercel

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Select the GitHub repository "eduzayn/lms_edunexia"
4. Click "Import"

### 2. Configure Project Settings

1. Framework Preset: Select "Next.js"
2. Root Directory: Leave as default (/)
3. Build Command: Use default (`npm run build`)
4. Output Directory: Use default (`.next`)
5. Install Command: Use default (`npm install`)

### 3. Configure Environment Variables

Add the following environment variables:

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
VIDEO_WORKER_SECRET=your_video_worker_secret
```

### 4. Deploy

1. Click "Deploy"
2. Wait for the deployment to complete
3. Once deployed, Vercel will provide a URL to access your application

## Testing the Deployment

After deployment, you should test the following features:

1. **Authentication**
   - User registration
   - User login
   - Password reset

2. **Student Portal**
   - Course access
   - Progress tracking
   - AI tutor interaction
   - Financial management

3. **Admin Portal**
   - User management
   - Course management
   - Content creation
   - Analytics dashboard

4. **Video Integration**
   - Video generation
   - Course/lesson association
   - Feedback mechanism
   - Background processing

## Troubleshooting

If you encounter issues during deployment:

1. Check the build logs for errors
2. Verify that all environment variables are correctly set
3. Ensure that the Supabase project is properly configured
4. Check that all API keys are valid and have the necessary permissions

## Continuous Deployment

Vercel automatically deploys changes when new commits are pushed to the main branch. To manually trigger a deployment:

1. Go to the project dashboard in Vercel
2. Click "Deployments"
3. Click "Redeploy" on the deployment you want to rebuild

## Custom Domain Configuration

To configure a custom domain:

1. Go to the project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow the instructions to verify domain ownership and configure DNS settings
