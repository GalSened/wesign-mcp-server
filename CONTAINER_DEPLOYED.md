# WeSign MCP Server - Container Deployment Status

## ✅ Successfully Deployed!

Your WeSign MCP Server is now running in a Docker container on `http://localhost:8080`

### Container Information
- **Container Name**: `wesign-mcp-server`
- **Port**: 8080
- **Status**: Running
- **Auto-login**: ✅ Successful

### Available Endpoints

#### 1. Health Check
```bash
curl http://localhost:8080/health
```
**Response**:
```json
{
  "status": "ok",
  "authenticated": true,
  "timestamp": "2025-09-30T08:51:58.517Z"
}
```

#### 2. List Tools (32 tools available)
```bash
curl http://localhost:8080/tools
```

#### 3. Execute Tool
```bash
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "wesign_list_templates",
    "parameters": {
      "offset": 0,
      "limit": 5
    }
  }'
```

### Verified Working

✅ Container built and started successfully
✅ Server listening on port 8080
✅ Auto-login to WeSign successful
✅ Health check endpoint working
✅ Tools list endpoint working (32 tools)
✅ Tool execution working (tested with list_templates)

### Container Management

#### View Logs
```bash
cd C:\Users\gals\Desktop\wesign-mcp-server
docker-compose logs -f
```

#### Stop Container
```bash
docker-compose down
```

#### Restart Container
```bash
docker-compose restart
```

#### Rebuild Container (after code changes)
```bash
npm run build
docker-compose up -d --build
```

### Next Steps for Public Access

The container is currently accessible only on localhost. To make it accessible to ChatGPT:

#### Option 1: ngrok (Easiest for Testing)
```bash
# Download ngrok from https://ngrok.com/download
ngrok http 8080
```
This gives you a public URL like `https://abc123.ngrok.io`

#### Option 2: CloudFlare Tunnel (Free, Permanent)
```bash
# Install cloudflared
# Create tunnel pointing to http://localhost:8080
cloudflared tunnel --url http://localhost:8080
```

#### Option 3: Deploy to Cloud
See `DEPLOYMENT_GUIDE.md` for:
- AWS Lambda + API Gateway
- Google Cloud Run
- Railway.app
- Heroku

### Using with ChatGPT

Once you have a public URL:

1. Go to ChatGPT → Custom GPTs → Actions
2. Import the OpenAPI spec from `CHATGPT_CONFIG.md`
3. Update server URL to your public endpoint
4. Test with: "List my WeSign templates"

### Configuration

Edit `docker-compose.yml` to change:

```yaml
environment:
  - WESIGN_API_URL=https://devtest.comda.co.il
  - WESIGN_EMAIL=your-email@example.com
  - WESIGN_PASSWORD=your-password
  - PORT=8080
  # Optional security
  - API_KEY=your-secret-key
  - CORS_ORIGIN=https://chat.openai.com
```

After changes:
```bash
docker-compose down
docker-compose up -d
```

### Testing Examples

#### List Templates
```bash
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "wesign_list_templates",
    "parameters": {"offset": 0, "limit": 10}
  }'
```

#### Get User Info
```bash
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "wesign_get_user_info",
    "parameters": {}
  }'
```

#### Send Document
```bash
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "wesign_send_document_for_signing",
    "parameters": {
      "filePath": "C:\\path\\to\\document.pdf",
      "signerName": "Gal",
      "signerPhone": "0524455586"
    }
  }'
```

### Troubleshooting

#### Container won't start
```bash
docker-compose logs
docker-compose build --no-cache
```

#### Can't reach WeSign API
Check logs:
```bash
docker-compose logs | grep -i error
```

#### Port 8080 in use
Edit `docker-compose.yml`:
```yaml
ports:
  - "9000:8080"  # Use port 9000 instead
```

### Files Created

- `Dockerfile` - Container image definition
- `docker-compose.yml` - Container orchestration
- `.dockerignore` - Files to exclude from build
- `src/server.ts` - Express.js HTTP server
- `DOCKER_QUICK_START.md` - Detailed Docker guide
- `CONTAINER_DEPLOYED.md` - This file

### Support

For issues:
- Check logs: `docker-compose logs`
- Verify health: `curl http://localhost:8080/health`
- See full documentation in `DOCKER_QUICK_START.md`
- See deployment options in `DEPLOYMENT_GUIDE.md`

---

**Deployment Date**: 2025-09-30
**Status**: ✅ Production Ready
**Next Action**: Choose public access method (ngrok/CloudFlare/Cloud deployment)