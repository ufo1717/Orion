# Orion Trading Bot - Cloudflare Edition 🚀

A sophisticated cryptocurrency trading bot deployed on Cloudflare's global edge network, providing zero-cost hosting with enterprise-grade performance and security.

## ✨ Features

- **Real-time Trading Analytics** - Live market data and performance metrics
- **Multi-Strategy Support** - Conservative, Balanced, and Aggressive trading strategies
- **User Authentication** - Secure JWT-based authentication system
- **Session Management** - Fast session storage with automatic expiry
- **Rate Limiting** - Built-in protection against API abuse
- **Global CDN** - Deployed to 275+ edge locations worldwide
- **Zero Cost** - Fully running on Cloudflare's free tier

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Cloudflare Edge Network                │
│  (275+ Global Locations)                                 │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages      │  │   Workers    │  │   Analytics   │  │
│  │   (Frontend) │  │   (API)      │  │   (Metrics)   │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│         │                  │                  │          │
│         └──────────┬───────┴──────────┬───────┘          │
│                    │                  │                  │
│         ┌──────────▼──────┐  ┌───────▼────────┐         │
│         │    D1 Database   │  │   KV Storage   │         │
│         │  (Users, Trades) │  │ (Sessions, Cache)│        │
│         └──────────────────┘  └────────────────┘         │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- Cloudflare account (free)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sherrymcadams001-afk/Orion.git
   cd Orion
   ```

2. **Install frontend dependencies**
   ```bash
   cd orion-trading-bot
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Cloudflare Deployment

See [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) for detailed deployment instructions.

**Quick deployment:**

1. Install Wrangler CLI: `npm install -g wrangler`
2. Login: `wrangler login`
3. Create D1 database: `npx wrangler d1 create orion-trading-db`
4. Create KV namespaces: `npx wrangler kv:namespace create SESSIONS`
5. Update `wrangler.toml` with your IDs
6. Deploy: `npx wrangler deploy`

## 📁 Project Structure

```
Orion/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── orion-trading-bot/          # Frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── utils/              # Utility functions
│   │   ├── data/               # Market data
│   │   └── config/             # Configuration
│   ├── package.json
│   └── vite.config.ts
├── workers/                    # Cloudflare Workers API
│   ├── api/
│   │   └── index.ts           # Main API endpoint
│   ├── package.json
│   └── tsconfig.json
├── schema.sql                  # D1 database schema
├── wrangler.toml              # Cloudflare configuration
└── CLOUDFLARE_DEPLOYMENT.md   # Deployment guide
```

## 🔧 Configuration

### Environment Variables

Set these in Cloudflare Dashboard or via Wrangler:

- `JWT_SECRET` - Secret key for JWT token generation
- `BINANCE_API_KEY` - Binance API key (optional)
- `ENVIRONMENT` - Deployment environment (production/preview)

### Database Schema

The D1 database includes:
- `users` - User accounts and authentication
- `user_profiles` - User preferences and settings
- `trade_logs` - Trading activity history
- `sessions` - Active user sessions
- `analytics` - Performance metrics

### API Endpoints

**Public:**
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - User login

**Protected (requires JWT):**
- `GET /api/profile` - Get user profile
- `GET /api/strategies` - List available strategies
- `POST /api/strategies/activate` - Activate trading strategy
- `GET /api/trades` - Get trade history
- `GET /api/analytics` - Get performance analytics
- `POST /api/auth/logout` - User logout

## 🔒 Security

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - SHA-256 hashing for passwords
- **CORS Protection** - Configurable CORS headers
- **Rate Limiting** - KV-based rate limiting
- **Session Management** - Auto-expiring sessions
- **DDoS Protection** - Built-in Cloudflare protection

## 📊 Monitoring

### Cloudflare Dashboard

- Real-time analytics
- Request metrics by country
- Error rates and response times
- Resource usage tracking

### Worker Logs

```bash
# Tail production logs
npx wrangler tail --env production

# View recent requests
npx wrangler tail --format pretty
```

### Database Queries

```bash
# View user count
npx wrangler d1 execute orion-trading-db \
  --command="SELECT COUNT(*) FROM users"

# View recent trades
npx wrangler d1 execute orion-trading-db \
  --command="SELECT * FROM trade_logs ORDER BY timestamp DESC LIMIT 10"
```

## 💰 Cost Analysis

Running on 100% free tier:

| Service | Free Tier | Monthly Cost |
|---------|-----------|--------------|
| Cloudflare Pages | 500 builds/month, unlimited bandwidth | $0 |
| Cloudflare Workers | 100,000 requests/day | $0 |
| Cloudflare D1 | 100k reads/day, 1k writes/day | $0 |
| Cloudflare KV | 100k reads/day, 1k writes/day | $0 |
| SSL/CDN | Unlimited | $0 |
| **TOTAL** | | **$0/month** |

## 🧪 Testing

### Run Tests

```bash
cd orion-trading-bot
npm run test
```

### Lint Code

```bash
npm run lint
```

### Type Check

```bash
npx tsc --noEmit
```

## 📚 Documentation

- [App Walkthrough](./APP_WALKTHROUGH.md)
- [Authentication Setup](./AUTHENTICATION_SETUP.md)
- [Cloudflare Deployment](./CLOUDFLARE_DEPLOYMENT.md)
- [Market Regime System](./MARKET_REGIME_SYSTEM.md)
- [Real Data Implementation](./REAL_DATA_IMPLEMENTATION.md)
- [Testing Summary](./TESTING_SUMMARY.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Live Demo](https://orion-trading-bot.pages.dev) (after deployment)
- [Cloudflare Dashboard](https://dash.cloudflare.com)
- [API Documentation](./API_DOCUMENTATION.md)

## 🆘 Support

For issues and questions:
- Check [CLOUDFLARE_DEPLOYMENT.md](./CLOUDFLARE_DEPLOYMENT.md) for deployment help
- Review [GitHub Issues](https://github.com/sherrymcadams001-afk/Orion/issues)
- Consult [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

## 🎯 Roadmap

- [x] Cloudflare Pages deployment
- [x] Workers API with JWT auth
- [x] D1 database integration
- [x] KV session storage
- [x] Rate limiting
- [x] Analytics tracking
- [ ] WebSocket support for real-time updates
- [ ] Advanced trading algorithms
- [ ] Multi-exchange support
- [ ] Mobile app integration

---

Built with ❤️ using React, TypeScript, and Cloudflare Edge
