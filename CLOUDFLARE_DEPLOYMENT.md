# Cloudflare Deployment Guide

This guide explains how to deploy the Orion Trading Bot to Cloudflare's global edge network using Pages, Workers, D1, and KV.

## 🌐 Architecture Overview

- **Cloudflare Pages**: Frontend hosting with global CDN
- **Cloudflare Workers**: Serverless API backend
- **Cloudflare D1**: SQLite database for user data and trading logs
- **Cloudflare KV**: Key-value storage for sessions and caching
- **Cloudflare Analytics**: Real-time monitoring and analytics

## 📋 Prerequisites

1. **Cloudflare Account** (Free tier available)
   - Sign up at https://dash.cloudflare.com/sign-up

2. **Wrangler CLI** (Cloudflare's deployment tool)
   ```bash
   npm install -g wrangler
   ```

3. **GitHub Repository Secrets**
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

## 🚀 Initial Setup

### Step 1: Authenticate with Cloudflare

```bash
# Login to Cloudflare
wrangler login
```

This will open a browser window to authenticate with your Cloudflare account.

### Step 2: Create D1 Database

```bash
# Create the database
npx wrangler d1 create orion-trading-db
```

**Output:**
```
✅ Successfully created DB 'orion-trading-db'

[[d1_databases]]
binding = "DB"
database_name = "orion-trading-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Copy the `database_id` and update `wrangler.toml`:
- Uncomment the `[[d1_databases]]` section
- Replace `your-d1-database-id` with your actual database ID

### Step 3: Run Database Migrations

```bash
# Apply the schema
npx wrangler d1 execute orion-trading-db --file=./schema.sql
```

**Verify tables:**
```bash
npx wrangler d1 execute orion-trading-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

### Step 4: Create KV Namespaces

```bash
# Create KV namespace for sessions
npx wrangler kv:namespace create SESSIONS

# Create KV namespace for cache
npx wrangler kv:namespace create CACHE
```

**Output for each:**
```
✅ Successfully created KV namespace
[[kv_namespaces]]
binding = "SESSIONS"
id = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

Update `wrangler.toml`:
- Uncomment the `[[kv_namespaces]]` sections
- Replace the placeholder IDs with your actual namespace IDs

### Step 5: Set Secrets

```bash
# Set JWT secret for production
npx wrangler secret put JWT_SECRET --env production
# Enter a strong random string (e.g., output of: openssl rand -base64 32)

# Set Binance API key (optional, if integrating with Binance)
npx wrangler secret put BINANCE_API_KEY --env production

# Repeat for preview environment
npx wrangler secret put JWT_SECRET --env preview
npx wrangler secret put BINANCE_API_KEY --env preview
```

**Generate secure JWT secret:**
```bash
openssl rand -base64 32
```

### Step 6: Deploy Workers

```bash
# Deploy to production
cd workers
npx wrangler deploy --env production

# Deploy to preview
npx wrangler deploy --env preview
```

### Step 7: Create Cloudflare Pages Project

1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command:** `cd orion-trading-bot && npm install && npm run build`
   - **Build output directory:** `orion-trading-bot/dist`
   - **Root directory:** `/`

### Step 8: Configure GitHub Secrets

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:

**CLOUDFLARE_API_TOKEN:**
- Go to Cloudflare Dashboard → My Profile → API Tokens
- Click "Create Token"
- Use "Edit Cloudflare Workers" template
- Add "Account Settings:Read" permission
- Copy the token and add to GitHub secrets

**CLOUDFLARE_ACCOUNT_ID:**
- Go to Cloudflare Dashboard → Workers & Pages
- Copy the Account ID from the right sidebar
- Add to GitHub secrets

## 🔄 Automatic Deployments

Once configured, deployments happen automatically:

1. **Push to `main` branch:** Deploys to production
2. **Open Pull Request:** Creates preview deployment
3. **Merge PR:** Updates production deployment

## 🧪 Testing Locally

### Test Frontend Build

```bash
cd orion-trading-bot
npm install
npm run build
npm run preview
```

### Test Workers Locally

```bash
# Start local development server
cd workers
npx wrangler dev

# Test with curl
curl http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test D1 Locally

```bash
# Execute local query
npx wrangler d1 execute orion-trading-db --local --command="SELECT * FROM users"
```

## 📊 Monitoring & Analytics

### View Analytics Dashboard

1. Cloudflare Dashboard → Analytics & Logs
2. View real-time metrics:
   - Request volume
   - Response times
   - Error rates
   - Geographic distribution

### View Worker Logs

```bash
# Tail production logs
npx wrangler tail --env production

# Tail preview logs
npx wrangler tail --env preview
```

### Query Analytics Data

```bash
# View D1 database statistics
npx wrangler d1 info orion-trading-db

# View KV namespace usage
npx wrangler kv:namespace list
```

## 🔒 Security Best Practices

1. **Rotate Secrets Regularly**
   ```bash
   npx wrangler secret put JWT_SECRET --env production
   ```

2. **Monitor Rate Limits**
   - Check Cloudflare Dashboard for usage
   - Adjust rate limiting in `workers/api/index.ts`

3. **Enable Security Headers**
   - Configured automatically in Workers

4. **Use Environment-Specific Secrets**
   - Keep production and preview secrets separate

## 🆓 Free Tier Limits

| Service | Free Tier Limit | Expected Usage |
|---------|----------------|----------------|
| Pages | 500 builds/month, unlimited bandwidth | ~100 builds/month |
| Workers | 100,000 requests/day | ~10,000 requests/day |
| D1 | 100k reads/day, 1k writes/day, 5GB storage | ~50k reads, 500 writes |
| KV | 100k reads/day, 1k writes/day, 1GB storage | ~30k reads, 200 writes |
| Analytics | Unlimited | Real-time tracking |

## 🐛 Troubleshooting

### Build Fails

**Check build logs:**
```bash
# In GitHub Actions
# Go to Actions tab → Select failed workflow → View logs
```

**Test locally:**
```bash
cd orion-trading-bot
npm ci
npm run build
```

### Worker Deployment Fails

**Check wrangler.toml:**
- Verify all database IDs are correct
- Ensure KV namespace IDs match

**Test deployment:**
```bash
cd workers
npx wrangler deploy --dry-run
```

### Database Connection Issues

**Verify D1 database exists:**
```bash
npx wrangler d1 list
```

**Test connection:**
```bash
npx wrangler d1 execute orion-trading-db --command="SELECT 1"
```

### CORS Errors

The Workers API includes CORS headers by default. If you still encounter issues:

1. Check browser console for specific error
2. Verify `Access-Control-Allow-Origin` in response headers
3. Update CORS configuration in `workers/api/index.ts`

## 📚 Additional Resources

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare KV Documentation](https://developers.cloudflare.com/kv/)
- [Wrangler CLI Reference](https://developers.cloudflare.com/workers/wrangler/)

## 🎯 Next Steps

1. ✅ Complete initial setup (Steps 1-8)
2. ✅ Verify deployment with test API call
3. ✅ Monitor analytics dashboard
4. ✅ Configure custom domain (optional)
5. ✅ Set up staging environment (optional)

## 💡 Tips

- Use `wrangler dev` for local testing before deployment
- Monitor usage in Cloudflare Dashboard to stay within free tier
- Enable preview deployments for all PRs
- Use Analytics Engine for custom metrics
- Implement caching to reduce database queries
- Batch write operations to stay within D1 write limits
