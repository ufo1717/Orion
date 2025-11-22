#!/bin/bash
# Orion Trading Bot - Cloudflare Setup Script
# This script automates the initial Cloudflare setup process

set -e

echo "🚀 Orion Trading Bot - Cloudflare Setup"
echo "========================================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
    echo "✅ Wrangler installed"
else
    echo "✅ Wrangler CLI found"
fi

echo ""
echo "📝 Step 1: Logging into Cloudflare..."
wrangler login

echo ""
echo "📊 Step 2: Creating D1 Database..."
echo "Creating orion-trading-db..."
wrangler d1 create orion-trading-db > /tmp/d1-output.txt

# Extract database ID
DB_ID=$(grep "database_id" /tmp/d1-output.txt | awk -F'"' '{print $4}')

if [ -z "$DB_ID" ]; then
    echo "⚠️  Could not extract database ID automatically."
    echo "Please manually update wrangler.toml with the database ID shown above."
else
    echo "✅ D1 Database created with ID: $DB_ID"
    echo ""
    echo "Updating wrangler.toml..."
    
    # Uncomment and update D1 database configuration
    sed -i "s/# \[\[d1_databases\]\]/[[d1_databases]]/" wrangler.toml
    sed -i "s/# binding = \"DB\"/binding = \"DB\"/" wrangler.toml
    sed -i "s/# database_name = \"orion-trading-db\"/database_name = \"orion-trading-db\"/" wrangler.toml
    sed -i "s/# database_id = \"your-d1-database-id\"/database_id = \"$DB_ID\"/" wrangler.toml
    
    echo "✅ wrangler.toml updated with D1 database ID"
fi

echo ""
echo "📊 Step 3: Applying Database Schema..."
wrangler d1 execute orion-trading-db --file=./schema.sql
echo "✅ Database schema applied"

echo ""
echo "🔑 Step 4: Creating KV Namespaces..."

# Create SESSIONS namespace
echo "Creating SESSIONS namespace..."
wrangler kv:namespace create SESSIONS > /tmp/kv-sessions.txt
SESSIONS_ID=$(grep "id = " /tmp/kv-sessions.txt | awk -F'"' '{print $2}')

if [ -z "$SESSIONS_ID" ]; then
    echo "⚠️  Could not extract SESSIONS namespace ID automatically."
    cat /tmp/kv-sessions.txt
else
    echo "✅ SESSIONS namespace created with ID: $SESSIONS_ID"
    
    # Update wrangler.toml
    sed -i "s/# \[\[kv_namespaces\]\]/[[kv_namespaces]]/" wrangler.toml
    sed -i "s/# binding = \"SESSIONS\"/binding = \"SESSIONS\"/" wrangler.toml
    sed -i "s/# id = \"your-sessions-kv-id\"/id = \"$SESSIONS_ID\"/" wrangler.toml
fi

echo ""

# Create CACHE namespace
echo "Creating CACHE namespace..."
wrangler kv:namespace create CACHE > /tmp/kv-cache.txt
CACHE_ID=$(grep "id = " /tmp/kv-cache.txt | awk -F'"' '{print $2}')

if [ -z "$CACHE_ID" ]; then
    echo "⚠️  Could not extract CACHE namespace ID automatically."
    cat /tmp/kv-cache.txt
else
    echo "✅ CACHE namespace created with ID: $CACHE_ID"
    
    # Update wrangler.toml (second KV namespace)
    # This is trickier, might need manual update
    echo "Please manually update the CACHE namespace ID in wrangler.toml"
    echo "ID: $CACHE_ID"
fi

echo ""
echo "🔒 Step 5: Setting Secrets..."
echo "Please enter a secure JWT secret (or press Enter to generate one):"
read JWT_SECRET

if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "Generated JWT secret: $JWT_SECRET"
fi

echo "$JWT_SECRET" | wrangler secret put JWT_SECRET --env production
echo "✅ JWT_SECRET set for production"

echo ""
echo "$JWT_SECRET" | wrangler secret put JWT_SECRET --env preview
echo "✅ JWT_SECRET set for preview"

echo ""
echo "📦 Step 6: Installing Dependencies..."
cd orion-trading-bot
npm install
cd ..

cd workers
npm install
cd ..

echo "✅ Dependencies installed"

echo ""
echo "🏗️  Step 7: Building Frontend..."
cd orion-trading-bot
npm run build
cd ..
echo "✅ Frontend built successfully"

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Review wrangler.toml and ensure all IDs are correct"
echo "2. Deploy Workers: cd workers && npx wrangler deploy"
echo "3. Set up Cloudflare Pages for frontend deployment"
echo "4. Configure GitHub secrets (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)"
echo ""
echo "📖 For detailed instructions, see CLOUDFLARE_DEPLOYMENT.md"
echo ""
