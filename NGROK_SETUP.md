# ngrok Setup for WeSign MCP Server

## ngrok requires authentication (free account)

### Step 1: Sign up for ngrok (Free)

1. Go to: https://dashboard.ngrok.com/signup
2. Sign up with your email or GitHub
3. Verify your email

### Step 2: Get Your Authtoken

1. Go to: https://dashboard.ngrok.com/get-started/your-authtoken
2. Copy your authtoken (looks like: `2abc123...`)

### Step 3: Configure ngrok

**Option A: Using Command Line**
```bash
cd C:\Users\gals\Desktop\wesign-mcp-server
ngrok.exe config add-authtoken YOUR_TOKEN_HERE
```

**Option B: Manual Configuration**
Create file: `C:\Users\gals\AppData\Local\ngrok\ngrok.yml`
```yaml
version: "2"
authtoken: YOUR_TOKEN_HERE
```

### Step 4: Start ngrok Tunnel

```bash
cd C:\Users\gals\Desktop\wesign-mcp-server
ngrok.exe http 8080
```

You'll see output like:
```
Session Status                online
Account                       your-email@example.com
Version                       3.x.x
Region                        United States (us)
Latency                       50ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:8080

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**Your public URL**: `https://abc123.ngrok.io` ← Use this for ChatGPT!

### Step 5: Test Your Public Endpoint

```bash
# Test health check
curl https://YOUR-NGROK-URL.ngrok.io/health

# Test tools list
curl https://YOUR-NGROK-URL.ngrok.io/tools

# Test execute endpoint
curl -X POST https://YOUR-NGROK-URL.ngrok.io/execute \
  -H "Content-Type: application/json" \
  -d '{"tool":"wesign_list_templates","parameters":{"offset":0,"limit":5}}'
```

### Step 6: Configure ChatGPT

Now that you have a public URL, configure ChatGPT:

1. Open ChatGPT
2. Go to: Settings → Custom GPTs → Create new GPT
3. Click "Configure" → "Actions"
4. Import OpenAPI spec from `CHATGPT_CONFIG.md`
5. Replace `https://your-deployed-server.com` with your ngrok URL
6. Test with: "List my WeSign templates"

---

## Alternative: CloudFlare Tunnel (No Account Required for Basic Use)

If you prefer not to create an ngrok account, use CloudFlare Tunnel:

### Install CloudFlare Tunnel
```bash
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/

# Or using winget:
winget install --id Cloudflare.cloudflared
```

### Start Tunnel (No Login Required for Quick Test)
```bash
cloudflared tunnel --url http://localhost:8080
```

You'll get a URL like: `https://random-words-abc.trycloudflare.com`

---

## Alternative: LocalTunnel (No Account Required)

```bash
# Install globally
npm install -g localtunnel

# Start tunnel
lt --port 8080
```

You'll get a URL like: `https://random-subdomain.loca.lt`

---

## Which Option to Choose?

| Service | Account Required | Free Tier | Stability | Speed |
|---------|-----------------|-----------|-----------|-------|
| **ngrok** | ✅ Yes (free) | ✅ Good | ⭐⭐⭐⭐⭐ | Fast |
| **CloudFlare Tunnel** | ❌ No (quick test) | ✅ Unlimited | ⭐⭐⭐⭐ | Fast |
| **LocalTunnel** | ❌ No | ✅ Unlimited | ⭐⭐⭐ | Medium |

**Recommendation for Production**: ngrok (most stable, best performance)
**Recommendation for Quick Test**: CloudFlare Tunnel (no account needed)

---

## Security Notes

When exposing your server publicly:

### 1. Add API Key Authentication

Edit `docker-compose.yml`:
```yaml
environment:
  - API_KEY=your-secret-random-key-here
```

Restart container:
```bash
docker-compose down
docker-compose up -d
```

Test with API key:
```bash
curl -X POST https://your-url.ngrok.io/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-random-key-here" \
  -d '{"tool":"wesign_list_templates","parameters":{}}'
```

### 2. Restrict CORS Origin

Edit `docker-compose.yml`:
```yaml
environment:
  - CORS_ORIGIN=https://chat.openai.com
```

### 3. Monitor Usage

ngrok provides a web interface at `http://localhost:4040` where you can see:
- All incoming requests
- Response times
- Request/response details

---

## Troubleshooting

### ngrok: "ERR_NGROK_4018"
- You need to sign up and add your authtoken
- Follow Step 1-3 above

### CloudFlare: "Connection refused"
- Make sure Docker container is running: `docker ps`
- Check health: `curl http://localhost:8080/health`

### LocalTunnel: Password required
- Some LocalTunnel URLs require entering a one-time password
- The password is shown in the terminal

---

## Ready to Use!

Once you have your public URL:

✅ Test all endpoints
✅ Configure ChatGPT custom action
✅ Test with: "List my WeSign templates"
✅ Try: "Send document.pdf to john@example.com for signature"

See `CHATGPT_CONFIG.md` for full ChatGPT integration guide.