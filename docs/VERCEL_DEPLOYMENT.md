# Vercel Deployment Guide for AIR Platform

## Prerequisites

✅ Vercel CLI installed
✅ Vercel account (sign up at https://vercel.com)
✅ GitHub repository (optional but recommended)

## Deployment Steps

### 1. Login to Vercel

```bash
vercel login
```

This will open your browser to authenticate with Vercel.

### 2. Deploy to Vercel

From the project root directory:

```bash
vercel
```

Follow the prompts:
- **Set up and deploy**: Yes
- **Which scope**: Select your account/team
- **Link to existing project**: No (first time)
- **Project name**: air-platform (or your preferred name)
- **Directory**: ./ (current directory)
- **Override settings**: No

### 3. Configure Environment Variables

After initial deployment, add environment variables in Vercel Dashboard:

Go to: **Project Settings → Environment Variables**

Add the following:

```
DATABASE_URL=your_postgres_connection_string
REDIS_URL=your_redis_connection_string
AQI_API_KEY=your_aqi_api_key
AQI_API_BASE_URL=https://api.waqi.info/feed
NEXT_PUBLIC_APP_NAME=AIR
CACHE_ENABLED=true
CACHE_DEFAULT_TTL=3600
```

### 4. Set Up Database (PostgreSQL)

#### Option A: Vercel Postgres (Recommended)

1. Go to your project in Vercel Dashboard
2. Navigate to **Storage** tab
3. Click **Create Database** → **Postgres**
4. Follow the setup wizard
5. Vercel will automatically set `DATABASE_URL` environment variable

#### Option B: External PostgreSQL

Use any PostgreSQL provider:
- **Supabase** (Free tier available): https://supabase.com
- **Railway**: https://railway.app
- **Neon**: https://neon.tech
- **AWS RDS**
- **Azure Database for PostgreSQL**

Get the connection string and add it to `DATABASE_URL`

### 5. Set Up Redis Cache

#### Option A: Vercel KV (Recommended)

1. Go to your project in Vercel Dashboard
2. Navigate to **Storage** tab
3. Click **Create Database** → **KV** (Redis)
4. Vercel will automatically set `KV_*` environment variables

Update your code to use Vercel KV:
```typescript
// lib/redis.ts
import { createClient } from '@vercel/kv';
```

#### Option B: External Redis

Use any Redis provider:
- **Upstash** (Free tier, serverless): https://upstash.com
- **Redis Cloud**: https://redis.com/cloud
- **AWS ElastiCache**
- **Azure Cache for Redis**

Get the connection URL and add it to `REDIS_URL`

### 6. Run Database Migrations

After setting up the database, run migrations:

```bash
# Install Vercel CLI globally if not done
npm install -g vercel

# Pull environment variables locally
vercel env pull

# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

Or use Vercel's build command to run migrations automatically.

### 7. Production Deployment

Deploy to production:

```bash
vercel --prod
```

## Vercel Configuration

The project includes `vercel.json` with optimized settings:

```json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"]
}
```

## Post-Deployment

### 1. Get Your AQI API Key

Visit: https://aqicn.org/data-platform/token/
- Sign up for free API access
- Get your API token
- Add it to Vercel environment variables as `AQI_API_KEY`

### 2. Test Your Deployment

Visit your deployed URL:
- `https://your-project.vercel.app`
- Test the landing page
- Try the dashboard with a city search
- Check the community page

### 3. Set Up Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## Environment Variables Reference

### Required for Production

| Variable | Description | Where to Get |
|----------|-------------|--------------|
| `DATABASE_URL` | PostgreSQL connection string | Vercel Postgres or external provider |
| `REDIS_URL` | Redis connection string | Vercel KV or Upstash/Redis Cloud |
| `AQI_API_KEY` | Air quality API key | https://aqicn.org/data-platform/token/ |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `AQI_API_BASE_URL` | https://api.waqi.info/feed | AQI API base URL |
| `NEXT_PUBLIC_APP_NAME` | AIR | Application name |
| `CACHE_ENABLED` | true | Enable/disable caching |
| `CACHE_DEFAULT_TTL` | 3600 | Cache TTL in seconds |

## Continuous Deployment

### With GitHub Integration (Recommended)

1. Push your code to GitHub
2. In Vercel Dashboard, go to **Import Project**
3. Select your GitHub repository
4. Vercel will automatically deploy on every push to main branch

### Manual Deployments

```bash
# Deploy preview
vercel

# Deploy to production
vercel --prod

# Deploy specific branch
vercel --prod --branch=production
```

## Build Configuration

Update `package.json` to include build scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

## Troubleshooting

### Build Fails

- Check if all environment variables are set
- Ensure Prisma schema is valid
- Review build logs in Vercel Dashboard

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- Ensure SSL is configured properly

### Redis Connection Issues

- Verify `REDIS_URL` is correct
- For Upstash, use REST API if direct connection fails
- Check Redis provider firewall settings

### API Errors

- Ensure `AQI_API_KEY` is set and valid
- Check API rate limits
- Review API logs in Vercel Functions

## Monitoring & Analytics

### Vercel Analytics

Enable in Project Settings → Analytics

### Performance Monitoring

- Use Vercel Speed Insights
- Monitor Core Web Vitals
- Set up error tracking (Sentry recommended)

## Cost Considerations

### Vercel Free Tier Includes:
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function executions
- Automatic HTTPS
- DDoS protection

### Additional Costs:
- **Vercel Postgres**: $0.30/GB stored + compute costs
- **Vercel KV (Redis)**: $0.20/GB stored + request costs
- Exceeding bandwidth limits

### Cost Optimization:
- Use Redis caching aggressively
- Optimize images with Next.js Image component
- Use CDN for static assets
- Monitor function execution times

## Alternative: Deploy with Docker

If you prefer Docker deployment:

```bash
# Build Docker image
docker build -t air-platform .

# Push to container registry
docker tag air-platform your-registry/air-platform
docker push your-registry/air-platform

# Deploy to your preferred platform
# (AWS ECS, Azure Container Apps, Google Cloud Run, etc.)
```

## Useful Commands

```bash
# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel remove [deployment-id]

# Pull environment variables
vercel env pull

# Add environment variable
vercel env add [variable-name]

# View project info
vercel inspect
```

## Next Steps After Deployment

1. ✅ Verify all pages load correctly
2. ✅ Test API endpoints
3. ✅ Check database connectivity
4. ✅ Verify Redis caching
5. ✅ Test AQI data fetching
6. ✅ Set up monitoring and alerts
7. ✅ Configure custom domain (optional)
8. ✅ Enable analytics

---

**Your AIR platform is now live on Vercel!** 🎉

Share your deployment URL and start helping people understand their air quality.
