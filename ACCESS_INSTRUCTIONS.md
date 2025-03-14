# Edunexia LMS - Access Instructions

This guide provides comprehensive instructions for accessing and testing the Edunexia LMS platform.

## Repository Access

1. Clone the repository:
   ```bash
   git clone https://github.com/eduzayn/lms_edunexia.git
   cd lms_edunexia
   ```

## Environment Setup

1. Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   OPENAI_API_KEY=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
   DATABASE_URL=postgresql://postgres:EDUNEXIA2028@db.uasnyifizdjxogowijip.supabase.co:5432/postgres
   ```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. Access the application at http://localhost:3000

## Vercel Deployment

To deploy the application to Vercel:

1. Log in to your Vercel account
2. Connect your GitHub repository
3. Configure the project settings as described in the [Vercel Deployment Guide](./vercel-deployment-guide.md)

## Testing Key Features

### Video Integration Features

1. **Video Generation**
   - Navigate to Admin > Content > Video
   - Create a new video with course/lesson association
   - Check the background processing status

2. **Video Player**
   - Play a video from the content library
   - Test the feedback mechanism
   - Verify progress tracking

3. **Course Integration**
   - Associate videos with specific courses and lessons
   - Verify the association in the course view

### AI Tutoring Features

1. **Prof. Ana Interaction**
   - Navigate to Student > AI Tutor
   - Test conversation with the AI tutor
   - Try asking questions about course content

2. **Assessment Feedback**
   - Submit a discursive assessment
   - Check the AI-generated feedback

### Financial Management

1. **Debt Negotiation**
   - Navigate to Student > Financial > Debt Negotiation
   - Test the negotiation workflow

2. **Administrative Fees**
   - Navigate to Student > Financial > Administrative Fees
   - Test payment of administrative fees

## Troubleshooting

If you encounter issues:

1. **Database Connection**
   - Verify your Supabase credentials
   - Check the database connection string

2. **API Keys**
   - Ensure all API keys are correctly configured
   - Check for any error messages related to API access

3. **Build Errors**
   - Check the console for any build errors
   - Verify that all dependencies are installed

## Contact

For any questions or issues, please contact the development team at ti@eduzayn.com.br
