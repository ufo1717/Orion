# API Testing Guide

This guide provides examples for testing the Orion Trading Bot API using various tools.

## Prerequisites

- API deployed and running (locally or on Cloudflare)
- API base URL (e.g., `http://localhost:8787` or `https://orion-api.workers.dev`)

## Using cURL

### 1. Register a New User

```bash
curl -X POST http://localhost:8787/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123",
    "tier": 1
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "tier": 1,
    "balance": 10000
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123"
  }'
```

### 3. Get User Profile (Protected)

```bash
# Replace YOUR_JWT_TOKEN with the token from login/register
curl -X GET http://localhost:8787/api/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Get Available Strategies

```bash
curl -X GET http://localhost:8787/api/strategies \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Activate Strategy

```bash
curl -X POST http://localhost:8787/api/strategies/activate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "strategyId": 1,
    "strategyName": "Conservative Growth"
  }'
```

### 6. Get Trade History

```bash
curl -X GET http://localhost:8787/api/trades \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. Get Analytics

```bash
curl -X GET http://localhost:8787/api/analytics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8. Logout

```bash
curl -X POST http://localhost:8787/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Using HTTPie

HTTPie is a user-friendly HTTP client. Install with `pip install httpie`.

### Register

```bash
http POST http://localhost:8787/api/auth/register \
  email=test@example.com \
  password=SecurePassword123 \
  tier:=1
```

### Login

```bash
http POST http://localhost:8787/api/auth/login \
  email=test@example.com \
  password=SecurePassword123
```

### Get Profile

```bash
http GET http://localhost:8787/api/profile \
  Authorization:"Bearer YOUR_JWT_TOKEN"
```

## Using Postman

### Setup

1. Import the following as a Postman Collection
2. Create an environment variable `BASE_URL` = `http://localhost:8787`
3. Create an environment variable `TOKEN` (will be set automatically)

### Collection Script (Pre-request)

Add this to Collection's Pre-request Script to auto-populate token:

```javascript
// If token exists in environment, use it
if (pm.environment.get("TOKEN")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("TOKEN")
    });
}
```

### Collection Script (Tests)

Add this to Collection's Tests to auto-save token:

```javascript
// Save token from login/register responses
if (pm.response.json().token) {
    pm.environment.set("TOKEN", pm.response.json().token);
}
```

### Requests

1. **Register**
   - Method: POST
   - URL: `{{BASE_URL}}/api/auth/register`
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "SecurePassword123",
       "tier": 1
     }
     ```

2. **Login**
   - Method: POST
   - URL: `{{BASE_URL}}/api/auth/login`
   - Body (JSON):
     ```json
     {
       "email": "test@example.com",
       "password": "SecurePassword123"
     }
     ```

3. **Get Profile**
   - Method: GET
   - URL: `{{BASE_URL}}/api/profile`
   - Auth: Bearer Token (automatically added by collection script)

## Using JavaScript/Fetch

### Complete Example

```javascript
// Configuration
const BASE_URL = 'http://localhost:8787';
let authToken = null;

// 1. Register
async function register() {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'SecurePassword123',
      tier: 1
    })
  });
  
  const data = await response.json();
  authToken = data.token;
  console.log('Registered:', data);
  return data;
}

// 2. Login
async function login() {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'SecurePassword123'
    })
  });
  
  const data = await response.json();
  authToken = data.token;
  console.log('Logged in:', data);
  return data;
}

// 3. Get Profile
async function getProfile() {
  const response = await fetch(`${BASE_URL}/api/profile`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const data = await response.json();
  console.log('Profile:', data);
  return data;
}

// 4. Get Strategies
async function getStrategies() {
  const response = await fetch(`${BASE_URL}/api/strategies`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const data = await response.json();
  console.log('Strategies:', data);
  return data;
}

// 5. Activate Strategy
async function activateStrategy(strategyId, strategyName) {
  const response = await fetch(`${BASE_URL}/api/strategies/activate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ strategyId, strategyName })
  });
  
  const data = await response.json();
  console.log('Strategy activated:', data);
  return data;
}

// 6. Get Trades
async function getTrades() {
  const response = await fetch(`${BASE_URL}/api/trades`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const data = await response.json();
  console.log('Trades:', data);
  return data;
}

// 7. Get Analytics
async function getAnalytics() {
  const response = await fetch(`${BASE_URL}/api/analytics`, {
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const data = await response.json();
  console.log('Analytics:', data);
  return data;
}

// 8. Logout
async function logout() {
  const response = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${authToken}` }
  });
  
  const data = await response.json();
  authToken = null;
  console.log('Logged out:', data);
  return data;
}

// Run complete test flow
async function testFlow() {
  try {
    await register();
    await getProfile();
    await getStrategies();
    await activateStrategy(1, 'Conservative Growth');
    await getTrades();
    await getAnalytics();
    await logout();
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testFlow();
```

## Testing Locally with Wrangler

### Start Local Development Server

```bash
cd workers
npx wrangler dev
```

This starts a local server at `http://localhost:8787`.

### Test with Local D1

```bash
# Create local D1 database
npx wrangler d1 execute orion-trading-db --local --file=../schema.sql

# Query local database
npx wrangler d1 execute orion-trading-db --local --command="SELECT * FROM users"
```

## Error Testing

### Test Invalid Credentials

```bash
curl -X POST http://localhost:8787/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "WrongPassword"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid credentials"
}
```

### Test Missing Token

```bash
curl -X GET http://localhost:8787/api/profile
```

**Expected Response:**
```
Unauthorized
```

### Test Expired Token

Wait 1 hour after login, then try to access a protected endpoint. Token will be expired.

### Test Invalid Token

```bash
curl -X GET http://localhost:8787/api/profile \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Response:**
```
Invalid token
```

## Load Testing with Apache Bench

### Install Apache Bench

```bash
# Ubuntu/Debian
sudo apt-get install apache2-utils

# macOS
brew install httpd
```

### Run Load Test

```bash
# 1000 requests, 10 concurrent
ab -n 1000 -c 10 \
  -H "Content-Type: application/json" \
  -p /tmp/register.json \
  http://localhost:8787/api/auth/register

# Where /tmp/register.json contains:
# {"email":"test@example.com","password":"test123","tier":1}
```

## Automated Testing Script

Save this as `test-api.sh`:

```bash
#!/bin/bash
set -e

BASE_URL="${1:-http://localhost:8787}"
echo "Testing API at: $BASE_URL"

# Register
echo "1. Testing registration..."
RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","tier":1}')

TOKEN=$(echo $RESPONSE | jq -r '.token')

if [ "$TOKEN" = "null" ]; then
  echo "❌ Registration failed"
  echo $RESPONSE | jq
  exit 1
fi

echo "✅ Registration successful"

# Get Profile
echo "2. Testing get profile..."
PROFILE=$(curl -s -X GET $BASE_URL/api/profile \
  -H "Authorization: Bearer $TOKEN")

if echo $PROFILE | jq -e '.success' > /dev/null; then
  echo "✅ Get profile successful"
else
  echo "❌ Get profile failed"
  echo $PROFILE | jq
  exit 1
fi

# Get Strategies
echo "3. Testing get strategies..."
STRATEGIES=$(curl -s -X GET $BASE_URL/api/strategies \
  -H "Authorization: Bearer $TOKEN")

if echo $STRATEGIES | jq -e '.success' > /dev/null; then
  echo "✅ Get strategies successful"
else
  echo "❌ Get strategies failed"
  echo $STRATEGIES | jq
  exit 1
fi

echo ""
echo "✅ All tests passed!"
```

Make it executable:

```bash
chmod +x test-api.sh
./test-api.sh
```

## CI/CD Testing

Add to `.github/workflows/test.yml`:

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: |
          cd workers
          npm ci
      
      - name: Start local server
        run: |
          cd workers
          npx wrangler dev &
          sleep 10
      
      - name: Run tests
        run: |
          chmod +x test-api.sh
          ./test-api.sh http://localhost:8787
```

## Monitoring in Production

### View Real-time Logs

```bash
npx wrangler tail --env production
```

### Query Analytics

```bash
# View recent requests
npx wrangler tail --format pretty --env production

# Filter by status code
npx wrangler tail --status 401 --env production
```

---

**Happy Testing! 🚀**
