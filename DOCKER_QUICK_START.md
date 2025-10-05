# WeSign MCP Server - Docker Deployment

## Quick Start

### Prerequisites
- Docker Desktop installed and running
- Docker Compose installed (included with Docker Desktop)

### 1. Install Dependencies & Build

```bash
cd C:\Users\gals\Desktop\wesign-mcp-server
npm install
npm run build
```

### 2. Start the Container

```bash
docker-compose up -d
```

This will:
- Build the Docker image
- Start the container on port 8080
- Auto-login with configured credentials
- Run in the background

### 3. Check Status

```bash
# View container logs
docker-compose logs -f

# Check health
curl http://localhost:8080/health
```

### 4. Test the Server

```bash
# List available tools
curl http://localhost:8080/tools

# Execute a tool (list templates)
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "wesign_list_templates",
    "parameters": {
      "offset": 0,
      "limit": 10
    }
  }'
```

### 5. Stop the Container

```bash
docker-compose down
```

## API Endpoints

### Health Check
```
GET http://localhost:8080/health
```
Returns server status and authentication state.

### List Tools
```
GET http://localhost:8080/tools
```
Returns all available WeSign tools (31 tools).

### Execute Tool
```
POST http://localhost:8080/execute
Content-Type: application/json

{
  "tool": "tool_name",
  "parameters": {
    // tool-specific parameters
  }
}
```

## Example Requests

### Login
```bash
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "wesign_login",
    "parameters": {
      "email": "nirk@comsign.co.il",
      "password": "Comsign1!"
    }
  }'
```

### List Templates
```bash
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "wesign_list_templates",
    "parameters": {
      "offset": 0,
      "limit": 50
    }
  }'
```

### Get User Info
```bash
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "wesign_get_user_info",
    "parameters": {}
  }'
```

### Send Document for Signing
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

## Configuration

Edit `docker-compose.yml` to change:

### Environment Variables
```yaml
environment:
  - WESIGN_API_URL=https://devtest.comda.co.il
  - WESIGN_EMAIL=your-email@example.com
  - WESIGN_PASSWORD=your-password
  - PORT=8080
```

### Add API Key Security
```yaml
environment:
  - API_KEY=your-secret-key-here
```

Then include the key in requests:
```bash
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key-here" \
  -d '{"tool": "wesign_list_templates", "parameters": {}}'
```

### Change Port
```yaml
ports:
  - "9000:8080"  # Host port 9000 → Container port 8080
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs

# Rebuild image
docker-compose build --no-cache
docker-compose up -d
```

### Can't connect to WeSign API
```bash
# Check if container can reach the API
docker-compose exec wesign-mcp wget -O- https://devtest.comda.co.il
```

### Port already in use
```bash
# Find what's using port 8080
netstat -ano | findstr :8080

# Change port in docker-compose.yml
ports:
  - "8081:8080"
```

## Using with ChatGPT

Once running, you can use this container with ChatGPT:

1. Expose to internet using:
   - ngrok: `ngrok http 8080`
   - CloudFlare Tunnel
   - Port forwarding on your router

2. Get public URL (e.g., `https://abc123.ngrok.io`)

3. Configure ChatGPT custom action with OpenAPI spec pointing to your public URL

See `CHATGPT_CONFIG.md` for detailed ChatGPT integration steps.

## Production Deployment

For production use:
- Add API key authentication
- Enable rate limiting
- Use HTTPS (reverse proxy with nginx)
- Set up monitoring and logging
- Use Docker Swarm or Kubernetes for scaling

See `DEPLOYMENT_GUIDE.md` for cloud deployment options (AWS, Google Cloud, etc.).