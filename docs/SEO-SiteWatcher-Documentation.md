# SEO SiteWatcher - Complete Documentation

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Setup Instructions](#setup-instructions)
6. [Usage Guide](#usage-guide)
7. [API Documentation](#api-documentation)
8. [Deployment](#deployment)
9. [Security](#security)
10. [Performance](#performance)

## Overview

SEO SiteWatcher is a production-ready SaaS web application that monitors website SEO health, keyword rankings, and Google Search Console data in real-time. Built with modern web technologies, it provides comprehensive SEO analytics and insights to help businesses improve their search engine visibility.

### Key Capabilities
- Real-time keyword ranking monitoring
- Automated Google Search Console data synchronization
- Multi-website management from a single dashboard
- Intelligent SEO scoring with actionable recommendations
- CSV and PDF report generation
- Responsive design with dark/light mode support

## Features

### 🔐 Authentication & Security
- **Email Magic Links**: Passwordless authentication via NextAuth.js
- **Google OAuth Integration**: Secure connection to Google Search Console
- **Token Management**: Encrypted storage of Google API tokens
- **Session Management**: Secure JWT-based sessions

### 📊 Dashboard & Analytics
- **Real-time Metrics**: Live keyword rankings and performance data
- **Interactive Charts**: CTR trends and performance visualizations using Recharts
- **SEO Score**: Intelligent scoring algorithm with recommendations
- **Multi-site Support**: Track unlimited websites from one dashboard

### 🔍 Google Search Console Integration
- **Automated Data Sync**: Daily synchronization via Vercel cron jobs
- **Keyword Tracking**: Position, clicks, impressions, and CTR monitoring
- **Top Queries & Pages**: Identification of best-performing content
- **Search Performance**: Comprehensive search analytics

### 📄 Reporting & Export
- **CSV Export**: Detailed keyword data export
- **PDF Reports**: Professional SEO performance reports
- **Custom Date Ranges**: Flexible time period selection
- **Automated Insights**: AI-generated recommendations

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dark/Light Mode**: Theme switching with next-themes
- **Modern UI**: ShadCN UI components with Lucide icons
- **Smooth Animations**: Optimized user interactions

## Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **ShadCN UI**: Pre-built component library
- **Lucide React**: Modern icon library
- **Recharts**: Responsive charting library
- **next-themes**: Theme management

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Drizzle ORM**: Type-safe database operations
- **NeonDB**: PostgreSQL database with connection pooling
- **NextAuth.js**: Authentication framework
- **Google APIs**: Search Console and Analytics integration

### Development & Deployment
- **Vercel**: Serverless deployment platform
- **Vercel Cron**: Scheduled job execution
- **ESLint**: Code linting and formatting
- **Turbopack**: Fast development bundler

## Architecture

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  google_tokens JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sites table
CREATE TABLE sites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  domain TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Keywords table
CREATE TABLE keywords (
  id SERIAL PRIMARY KEY,
  site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  position REAL,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr REAL DEFAULT 0,
  date DATE NOT NULL
);

-- Reports table
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
  seo_score INTEGER NOT NULL,
  recommendations JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Google tokens table
CREATE TABLE google_tokens (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL
);
```

### API Endpoints

#### Authentication
- `GET/POST /api/auth/[...nextauth]` - NextAuth.js authentication endpoints

#### Sites Management
- `GET /api/sites` - Retrieve user's websites
- `POST /api/sites` - Add new website
- `DELETE /api/sites/[id]` - Remove website

#### Google Integration
- `GET /api/google/sites` - Fetch Google Search Console sites
- `POST /api/google/sync` - Sync website data

#### Automation
- `GET /api/cron/sync-keywords` - Daily keyword sync cron job

#### Health Check
- `GET /api/health` - Service health endpoint

### Component Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── dashboard/         # Dashboard pages
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   └── dashboard/        # Feature components
├── lib/                  # Core utilities
│   ├── db/              # Database layer
│   ├── auth.ts          # Authentication config
│   ├── google-api.ts    # Google API service
│   └── export.ts        # Export functionality
└── hooks/               # Custom React hooks
```

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- NeonDB account and database
- Google Cloud project with Search Console API enabled
- SMTP provider for email authentication

### Installation Steps

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd seo-sitewatcher
   npm install
   ```

2. **Environment Configuration**
   Create `.env.local` with required variables:
   ```env
   DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email"
   EMAIL_SERVER_PASSWORD="your-password"
   EMAIL_FROM="noreply@example.com"
   CRON_SECRET="your-cron-secret"
   ```

3. **Database Setup**
   ```bash
   npm run db:push
   ```

4. **Development Server**
   ```bash
   npm run dev
   ```

### Google API Configuration

1. **Enable APIs**
   - Google Search Console API
   - Google Analytics Reporting API

2. **OAuth Setup**
   - Create OAuth 2.0 credentials
   - Configure authorized redirect URIs
   - Set up OAuth consent screen

3. **Website Verification**
   - Verify websites in Google Search Console
   - Ensure proper permissions

## Usage Guide

### Getting Started

1. **Account Creation**
   - Visit the application homepage
   - Click "Sign In" and enter your email
   - Check email for magic link and click to authenticate

2. **Google Integration**
   - Connect Google account for Search Console access
   - Grant required permissions for data access
   - Verify website ownership in Search Console

3. **Website Management**
   - Navigate to "Websites" section
   - Add websites from your Search Console properties
   - Configure tracking preferences

### Dashboard Features

#### Overview Dashboard
- **Stats Cards**: Total websites, keywords, average position, CTR
- **SEO Score**: Overall health score with recommendations
- **CTR Chart**: Click-through rate trends over time
- **Keyword Rankings**: Top performing keywords table

#### Keyword Monitoring
- **Position Tracking**: Real-time ranking positions
- **Performance Metrics**: Clicks, impressions, CTR data
- **Historical Trends**: Position changes over time
- **Export Options**: CSV and PDF report generation

#### Website Analytics
- **Multi-site View**: All websites in one dashboard
- **Site-specific Data**: Individual website performance
- **Sync Controls**: Manual and automatic data updates
- **Status Monitoring**: Connection and sync status

### Report Generation

#### CSV Export
- Complete keyword data with all metrics
- Customizable date ranges
- Bulk export for multiple sites
- Import-ready format for analysis tools

#### PDF Reports
- Professional formatted reports
- Executive summary with key metrics
- Detailed keyword performance tables
- Actionable recommendations
- Branded design with charts and graphs

## API Documentation

### Authentication
All API routes require authentication via NextAuth.js session.

### Rate Limiting
- Google Search Console: 1,200 requests/day
- Internal APIs: No specific limits

### Error Handling
Standard HTTP status codes with descriptive error messages.

### Data Formats
- Dates: ISO 8601 format (YYYY-MM-DD)
- Numbers: Decimal precision for positions and CTR
- Text: UTF-8 encoding for all strings

## Deployment

### Vercel Deployment

1. **Initial Setup**
   ```bash
   npm i -g vercel
   vercel login
   vercel
   ```

2. **Environment Variables**
   Configure all environment variables in Vercel dashboard

3. **Database Migration**
   Run database migrations in production:
   ```bash
   npm run db:push
   ```

4. **Cron Jobs**
   Vercel automatically configures cron jobs from `vercel.json`

### Production Configuration

- **Domain Setup**: Configure custom domain
- **SSL Certificate**: Automatic HTTPS via Vercel
- **Edge Functions**: Optimized API performance
- **CDN**: Global content delivery

## Security

### Data Protection
- **Encryption**: All sensitive data encrypted at rest
- **Token Security**: Google tokens stored securely
- **Session Management**: Secure JWT implementation
- **SQL Injection Prevention**: Parameterized queries via Drizzle ORM

### Access Control
- **User Isolation**: Data scoped to authenticated users
- **Permission Validation**: API route protection
- **CORS Configuration**: Proper cross-origin policies
- **Rate Limiting**: API abuse prevention

### Privacy Compliance
- **Data Minimization**: Only collect necessary data
- **User Consent**: Clear permission requests
- **Data Retention**: Configurable retention policies
- **Export Rights**: User data export capabilities

## Performance

### Optimization Strategies
- **Server-side Rendering**: Fast initial page loads
- **Static Generation**: Pre-built pages where possible
- **Image Optimization**: Automatic Next.js optimization
- **Code Splitting**: Lazy loading of components
- **Database Indexing**: Optimized query performance

### Monitoring
- **Real-time Metrics**: Performance monitoring
- **Error Tracking**: Automatic error reporting
- **Usage Analytics**: User behavior insights
- **Health Checks**: Service availability monitoring

### Scalability
- **Serverless Architecture**: Auto-scaling capabilities
- **Connection Pooling**: Efficient database connections
- **CDN Distribution**: Global content delivery
- **Edge Computing**: Reduced latency

---

*This documentation is maintained alongside the codebase and updated with each release. For technical support, visit our GitHub repository or contact support@seositewatcher.com.*