# Netlify Deployment Guide

This guide will help you deploy the SEO SiteWatcher application to Netlify.

## Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **NeonDB Database**: Set up a PostgreSQL database on NeonDB
4. **Google Cloud Console**: Configure OAuth and Search Console API

## Step 1: Environment Setup

### Database Setup (NeonDB)
1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string (it should look like: `postgresql://user:password@host/database?sslmode=require`)

### Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Google Search Console API
   - Google Analytics Reporting API
4. Create OAuth 2.0 credentials
5. Add your Netlify domain to authorized redirect URIs

## Step 2: Netlify Deployment

### Option A: Deploy via Netlify UI

1. **Connect Repository**:
   - Log in to Netlify
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Configure Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Node version: `20`

3. **Set Environment Variables**:
   ```
   DATABASE_URL=postgresql://user:password@host/database?sslmode=require
   NEXTAUTH_SECRET=your-random-secret-here
   NEXTAUTH_URL=https://your-site-name.netlify.app
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   EMAIL_FROM=noreply@yourdomain.com
   CRON_SECRET=your-cron-secret
   NODE_ENV=production
   ```

4. **Deploy**:
   - Click "Deploy site"
   - Wait for build to complete

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Initialize and Deploy**:
   ```bash
   netlify init
   npm run build
   netlify deploy --prod --dir=out
   ```

## Step 3: Post-Deployment Configuration

### Custom Domain (Optional)
1. In Netlify dashboard, go to "Domain settings"
2. Add your custom domain
3. Update `NEXTAUTH_URL` environment variable
4. Update Google OAuth redirect URIs

### SSL Certificate
- Netlify automatically provides SSL certificates
- No additional configuration needed

## Step 4: Verify Deployment

1. **Health Check**: Visit `https://your-site.netlify.app/health`
2. **Main Application**: Visit your main domain
3. **Authentication**: Test sign-in functionality
4. **API Endpoints**: Verify all API routes work

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version (should be 20)
   - Verify all environment variables are set
   - Check build logs in Netlify dashboard

2. **Database Connection Issues**:
   - Verify `DATABASE_URL` is correct
   - Ensure NeonDB database is accessible
   - Check IP allowlist if configured

3. **Authentication Issues**:
   - Verify `NEXTAUTH_URL` matches your domain
   - Check Google OAuth redirect URIs
   - Ensure `NEXTAUTH_SECRET` is set

4. **API Route Issues**:
   - Check Netlify function logs
   - Verify function timeout settings
   - Ensure proper redirects in `netlify.toml`

### Environment Variables Checklist

- [ ] `DATABASE_URL` - NeonDB connection string
- [ ] `NEXTAUTH_SECRET` - Random string for session encryption
- [ ] `NEXTAUTH_URL` - Your Netlify domain
- [ ] `GOOGLE_CLIENT_ID` - Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- [ ] `EMAIL_SERVER_HOST` - SMTP server hostname
- [ ] `EMAIL_SERVER_PORT` - SMTP server port
- [ ] `EMAIL_SERVER_USER` - SMTP username
- [ ] `EMAIL_SERVER_PASSWORD` - SMTP password/app password
- [ ] `EMAIL_FROM` - From email address
- [ ] `CRON_SECRET` - Secret for cron job authentication
- [ ] `NODE_ENV` - Set to "production"

## Monitoring and Maintenance

### Logs
- View function logs in Netlify dashboard
- Monitor build logs for deployment issues
- Check application logs for runtime errors

### Updates
- Push changes to GitHub to trigger automatic deployment
- Monitor deployment status in Netlify dashboard
- Test functionality after each deployment

### Performance
- Monitor function execution times
- Check database connection performance
- Optimize images and assets for faster loading

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to Git
2. **Database Security**: Use connection pooling and SSL
3. **Authentication**: Regularly rotate secrets
4. **API Security**: Implement proper rate limiting
5. **CORS**: Configure appropriate CORS policies

## Support

For additional help:
- Check Netlify documentation
- Review Next.js deployment guides
- Consult the project README
- Open issues in the GitHub repository
