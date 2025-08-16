# SEO SiteWatcher

A production-ready SaaS web application that monitors website SEO health, keyword rankings, and Google Search Console data in real-time.

## Features

- 🔐 **Secure Authentication**: Email magic links + Google OAuth integration
- 📊 **Real-time Dashboard**: Keyword rankings, CTR charts, and SEO performance metrics
- 🔍 **Google Search Console Integration**: Automated data fetching and analysis
- 📈 **SEO Scoring**: Intelligent SEO health scoring with actionable recommendations
- 🌐 **Multi-website Management**: Track unlimited websites from a single dashboard
- 📄 **Export Functionality**: Generate CSV and PDF reports
- ⚡ **Automated Sync**: Daily data synchronization via Vercel cron jobs
- 🌙 **Dark/Light Mode**: Beautiful responsive design with theme switching
- 📱 **Mobile-first**: Fully responsive design optimized for all devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: Next.js API routes, Drizzle ORM
- **Database**: NeonDB (PostgreSQL)
- **Authentication**: NextAuth.js
- **External APIs**: Google Search Console API, Google Analytics Reporting API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel (with edge functions and cron jobs)

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A NeonDB account and database
- A Google Cloud Console project with Search Console API enabled
- A Gmail or SMTP provider for email authentication

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Provider (for magic links)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@seositewatcher.com"

# Cron Job Security
CRON_SECRET="your-cron-secret-here"

# Environment
NODE_ENV="development"
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd seo-sitewatcher
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.local` and fill in all required environment variables

4. **Set up the database**:
   ```bash
   npm run db:push
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel Deployment

1. **Connect to Vercel**:
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Set environment variables in Vercel**:
   - Add all environment variables from `.env.local`
   - Set `NEXTAUTH_URL` to your production domain

3. **Deploy**:
   ```bash
   vercel --prod
   ```

## Usage

1. **Sign Up/Sign In**: Use email magic link authentication
2. **Connect Google Account**: Enable Search Console data access
3. **Add Websites**: Import from Google Search Console
4. **Monitor Performance**: Track keywords, CTR, and SEO scores
5. **Export Reports**: Generate CSV and PDF reports

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

Built with ❤️ using Next.js 14, TypeScript, and Vercel.
