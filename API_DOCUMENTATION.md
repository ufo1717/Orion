# Orion Trading Bot - API Documentation

## Base URL

- **Production:** `https://api.orion-trading.com`
- **Preview:** `https://preview.orion-trading.com`
- **Local Development:** `http://localhost:8787`

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens expire after 1 hour and must be refreshed by logging in again.

## Endpoints

### Public Endpoints

#### Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "tier": 1
}
```

**Parameters:**
- `email` (string, required) - User email address
- `password` (string, required) - User password (min 8 characters recommended)
- `tier` (integer, optional) - User tier level (1-3), defaults to 1

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "tier": 1,
    "balance": 10000
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input or email already exists
- `500 Internal Server Error` - Server error

---

#### Login User

Authenticate existing user and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "tier": 1,
    "balance": 10000
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `400 Bad Request` - Missing email or password
- `500 Internal Server Error` - Server error

---

### Protected Endpoints

All protected endpoints require a valid JWT token in the `Authorization` header.

#### Logout User

Invalidate current session.

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true
}
```

---

#### Get User Profile

Retrieve detailed user profile information.

**Endpoint:** `GET /api/profile`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "profile": {
    "id": 1,
    "email": "user@example.com",
    "tier": 1,
    "balance": 10250.50,
    "created_at": "2025-11-22T05:00:00.000Z",
    "last_login": "2025-11-22T10:30:00.000Z",
    "active_strategy": "Conservative Growth",
    "onboarding_complete": 1,
    "preferences": "{\"theme\":\"dark\",\"notifications\":true}"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found
- `500 Internal Server Error` - Server error

---

#### Get Available Strategies

List trading strategies available to the user based on their tier.

**Endpoint:** `GET /api/strategies`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "strategies": [
    {
      "id": 1,
      "name": "Conservative Growth",
      "description": "Low-risk strategy with steady returns",
      "tier": 1,
      "risk_level": "low",
      "expected_return": "5-10%"
    },
    {
      "id": 2,
      "name": "Balanced Portfolio",
      "description": "Medium-risk strategy with balanced returns",
      "tier": 2,
      "risk_level": "medium",
      "expected_return": "10-20%"
    }
  ]
}
```

**Notes:**
- Only strategies available for user's tier are returned
- Tier 1: Conservative Growth only
- Tier 2: Conservative + Balanced
- Tier 3: All strategies

---

#### Activate Trading Strategy

Set the active trading strategy for the user.

**Endpoint:** `POST /api/strategies/activate`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "strategyId": 1,
  "strategyName": "Conservative Growth"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Strategy Conservative Growth activated"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `500 Internal Server Error` - Server error

---

#### Get Trade History

Retrieve user's trading history.

**Endpoint:** `GET /api/trades`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "trades": [
    {
      "id": 1,
      "user_id": 1,
      "timestamp": "2025-11-22T10:15:00.000Z",
      "pair": "BTC/USDT",
      "action": "BUY",
      "message": "Bought 0.1 BTC at $50,000",
      "profit": null,
      "price": 50000.00
    },
    {
      "id": 2,
      "user_id": 1,
      "timestamp": "2025-11-22T11:30:00.000Z",
      "pair": "BTC/USDT",
      "action": "SELL",
      "message": "Sold 0.1 BTC at $51,000",
      "profit": 100.00,
      "price": 51000.00
    }
  ]
}
```

**Notes:**
- Returns last 100 trades
- Ordered by timestamp (newest first)
- `action` can be: BUY, SELL, SCAN, EXECUTE

---

#### Get Analytics

Retrieve performance analytics for the user.

**Endpoint:** `GET /api/analytics`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "analytics": [
    {
      "id": 1,
      "user_id": 1,
      "period": "1d",
      "total_trades": 5,
      "winning_trades": 3,
      "total_profit": 150.50,
      "win_rate": 0.60,
      "calculated_at": "2025-11-22T12:00:00.000Z"
    },
    {
      "id": 2,
      "user_id": 1,
      "period": "7d",
      "total_trades": 25,
      "winning_trades": 18,
      "total_profit": 850.75,
      "win_rate": 0.72,
      "calculated_at": "2025-11-22T12:00:00.000Z"
    }
  ]
}
```

**Notes:**
- `period` can be: 1d, 7d, 30d
- Returns last 10 analytics records
- Ordered by calculation time (newest first)

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Email and password required"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```
or
```
Unauthorized
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```
or
```
Not found
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded"
}
```
Headers include:
```
Retry-After: 60
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Global rate limit:** 1200 requests per minute per IP
- **Binance API proxy:** 1200 requests per minute per IP
- Rate limit status included in response headers:
  - `X-RateLimit-Remaining`: Number of requests remaining

When rate limit is exceeded, the API returns `429 Too Many Requests` with a `Retry-After` header indicating how many seconds to wait.

---

## CORS

The API supports Cross-Origin Resource Sharing (CORS):

**Allowed Origins:** `*` (all origins)

**Allowed Methods:** `GET, POST, PUT, DELETE, OPTIONS`

**Allowed Headers:** `Content-Type, Authorization`

---

## Authentication Flow

### Registration and Login

1. **Register** or **Login** to receive JWT token
2. Store token securely (e.g., localStorage, secure cookie)
3. Include token in `Authorization` header for all protected requests
4. Token expires after 1 hour
5. Refresh token by logging in again

### Example Flow

```javascript
// 1. Login
const loginResponse = await fetch('https://api.orion-trading.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
const { token } = await loginResponse.json();

// 2. Store token
localStorage.setItem('jwt_token', token);

// 3. Use token for protected requests
const profileResponse = await fetch('https://api.orion-trading.com/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const profile = await profileResponse.json();

// 4. Logout when done
await fetch('https://api.orion-trading.com/api/auth/logout', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
localStorage.removeItem('jwt_token');
```

---

## Data Types

### User Tiers

| Tier | Name | Features |
|------|------|----------|
| 1 | Basic | Conservative strategy, basic analytics |
| 2 | Advanced | All tier 1 + Balanced strategy, enhanced analytics |
| 3 | Pro | All tier 2 + Aggressive strategy, advanced features |

### Trade Actions

- `BUY` - Purchase cryptocurrency
- `SELL` - Sell cryptocurrency
- `SCAN` - Market analysis/scanning
- `EXECUTE` - Execute trading strategy

### Analytics Periods

- `1d` - Last 24 hours
- `7d` - Last 7 days
- `30d` - Last 30 days

---

## SDK Examples

### JavaScript/TypeScript

```typescript
class OrionAPI {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    this.token = data.token;
    return data;
  }

  async getProfile() {
    const response = await fetch(`${this.baseUrl}/api/profile`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return response.json();
  }

  async getStrategies() {
    const response = await fetch(`${this.baseUrl}/api/strategies`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return response.json();
  }
}

// Usage
const api = new OrionAPI('https://api.orion-trading.com');
await api.login('user@example.com', 'password123');
const profile = await api.getProfile();
```

### Python

```python
import requests

class OrionAPI:
    def __init__(self, base_url):
        self.base_url = base_url
        self.token = None

    def login(self, email, password):
        response = requests.post(
            f"{self.base_url}/api/auth/login",
            json={"email": email, "password": password}
        )
        data = response.json()
        self.token = data['token']
        return data

    def get_profile(self):
        response = requests.get(
            f"{self.base_url}/api/profile",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        return response.json()

# Usage
api = OrionAPI('https://api.orion-trading.com')
api.login('user@example.com', 'password123')
profile = api.get_profile()
```

---

## Support

For API support and questions:
- GitHub Issues: https://github.com/sherrymcadams001-afk/Orion/issues
- Documentation: See CLOUDFLARE_DEPLOYMENT.md

---

**Last Updated:** November 22, 2025  
**API Version:** 1.0.0
