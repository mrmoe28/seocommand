# SEO SiteWatcher

A production-ready SaaS web application that monitors website SEO health, keyword rankings, and Google Search Console data in real-time.

## Features

- 🔐 **Secure Authentication**: Email magic links + Google OAuth integration
- 📊 **Real-time Dashboard**: Keyword rankings, CTR charts, and SEO performance metrics
- 🔍 **Google Search Console Integration**: Automated data fetching and analysis
- 📈 **SEO Scoring**: Intelligent SEO health scoring with actionable recommendations
- 🌐 **Multi-website Management**: Track unlimited websites from a single dashboard
- 📄 **Export Functionality**: Generate CSV and PDF reports
- ⚡ **Automated Sync**: Daily data synchronization via Netlify functions
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
- **Deployment**: Netlify (with serverless functions)

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

### Netlify Deployment

1. **Connect to Netlify**:
   - Push your code to GitHub
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `out`

2. **Set environment variables in Netlify**:
   - Add all environment variables from `.env.local`
   - Set `NEXTAUTH_URL` to your Netlify domain
   - Update `netlify.toml` with your actual domain

3. **Deploy**:
   - Netlify will automatically deploy on git push
   - Or trigger manual deployment from Netlify dashboard

### Manual Deployment

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload to Netlify**:
   - Drag and drop the `out` folder to Netlify
   - Or use Netlify CLI: `netlify deploy --prod --dir=out`

## Usage

1. **Sign Up/Sign In**: Use email magic link authentication
2. **Connect Google Account**: Enable Search Console data access
3. **Add Websites**: Import from Google Search Console
4. **Monitor Performance**: Track keywords, CTR, and SEO scores
5. **Export Reports**: Generate CSV and PDF reports

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio

Built with ❤️ using Next.js 14, TypeScript, and Netlify.
