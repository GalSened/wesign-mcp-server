# ChatGPT MCP Connector Setup Guide

## What Changed in 2025

ChatGPT now uses **MCP (Model Context Protocol)** for custom connectors instead of OpenAPI actions. This is a more powerful protocol that Claude Code also uses.

## Your Server Status

✅ **WeSign MCP HTTP Server is running**
- Public URL: `https://f1b9a644065e.ngrok-free.app`
- MCP Endpoint: `https://f1b9a644065e.ngrok-free.app/mcp`
- Protocol: MCP over HTTP (JSON-RPC 2.0)
- Tools: 32 WeSign tools available

## How to Add Custom MCP Connector to ChatGPT

### Requirements
- ChatGPT Pro, Business, Enterprise, or Edu account
- Custom connectors are NOT available on free ChatGPT

### Step-by-Step Setup

#### Step 1: Access Connectors Settings
1. Open ChatGPT: https://chat.openai.com
2. Click your **profile picture** (bottom left)
3. Click **"Settings"**
4. Click **"Connectors"** in the left sidebar

#### Step 2: Add Custom Connector
1. Scroll down to **"Custom Connectors"** section
2. Click **"Add connector"** or **"+"** button
3. You'll see a form to configure your MCP server

#### Step 3: Configure MCP Server
Fill in the following:

**Name**: `WeSign`

**Description**: `Digital signature and document management`

**Server URL**: `https://f1b9a644065e.ngrok-free.app/mcp`

**Protocol**: `MCP` (Model Context Protocol)

**Transport**: `HTTP`

**Icon** (optional): You can upload a custom icon

#### Step 4: Test Connection
1. Click **"Test connection"** button
2. Should show ✅ "Connected successfully"
3. Should list 32 available tools

#### Step 5: Save and Enable
1. Click **"Save"** or **"Add"**
2. Toggle the connector **ON**
3. The WeSign connector should now appear in your connectors list

### Step 6: Use in Chat
1. Start a new chat
2. In the message box, click the **"+" button** or **"Tools"** icon
3. Select **"Use connectors"**
4. Choose **"WeSign"**
5. Now you can type commands like:
   - "List my WeSign templates"
   - "Show my recent documents"
   - "Get my account info"

---

## Alternative: MCP Interest Form

If custom connectors aren't visible in your Settings:

1. Fill out OpenAI's MCP Connector Interest Form:
   https://openai.com/form/mcp-connector-interest-form/

2. Wait for access (usually granted within a few days)

---

## Testing Your MCP Server

### Test 1: Server Info
```bash
curl https://f1b9a644065e.ngrok-free.app/
```

**Expected**:
```json
{
  "name": "WeSign MCP Server",
  "version": "1.0.0",
  "protocol": "MCP",
  "transport": "HTTP",
  "endpoint": "/mcp",
  "capabilities": {"tools": true},
  "tools_count": 32
}
```

### Test 2: Health Check
```bash
curl https://f1b9a644065e.ngrok-free.app/health
```

**Expected**:
```json
{
  "status": "ok",
  "authenticated": true,
  "protocol": "MCP HTTP"
}
```

### Test 3: List Tools (MCP Protocol)
```bash
curl -X POST https://f1b9a644065e.ngrok-free.app/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/list",
    "params": {}
  }'
```

---

## Troubleshooting

### "Custom Connectors" not visible in Settings
**Solution**: Custom connectors require ChatGPT Pro or higher. Upgrade your account or fill out the MCP interest form.

### "Connection failed" error
**Solution**:
1. Verify ngrok is running: `tasklist | findstr ngrok`
2. Test server: `curl https://f1b9a644065e.ngrok-free.app/health`
3. Check Docker: `docker ps`

### Tools not showing up
**Solution**:
1. Restart the connector in Settings
2. Toggle OFF then ON
3. Restart ChatGPT

### ngrok URL changed
**Solution**:
1. Get new URL from ngrok terminal
2. Update connector URL in ChatGPT Settings
3. Test connection again

---

## What If I Don't Have ChatGPT Pro?

### Option 1: Use Claude Code (Already Working!)
Your WeSign MCP server already works perfectly with Claude Code:
- Open Claude Code
- It's already configured in your `.claude.json`
- Just use the WeSign tools directly

### Option 2: Wait for Free Access
OpenAI may open custom connectors to free users in the future.

### Option 3: Use the REST API
The old Express server (`server.ts`) still works with the `/execute` endpoint for direct API access.

---

## Monitoring Usage

### View ngrok Dashboard
Open: http://localhost:4040

You'll see:
- All incoming MCP requests from ChatGPT
- Request/response details
- Timing information

### View Docker Logs
```bash
docker-compose logs -f
```

---

## Example ChatGPT Prompts

Once configured:

**Templates**:
- "List my WeSign templates"
- "Show template details for [name]"
- "How many templates do I have?"

**Documents**:
- "List my recent documents"
- "Show document status for [name]"
- "Get signing status"

**Account**:
- "Show my WeSign account info"
- "How many documents can I send?"
- "Am I authenticated?"

**Sending** (limitations apply):
- "I want to send a document for signing" (ChatGPT will guide you through template selection)

---

## MCP Protocol Details

The WeSign MCP server implements:

**JSON-RPC 2.0** over HTTP:
- Endpoint: `/mcp`
- Methods:
  - `tools/list` - Get all available tools
  - `tools/call` - Execute a specific tool

**Request Format**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "wesign_list_templates",
    "arguments": {
      "offset": 0,
      "limit": 10
    }
  }
}
```

**Response Format**:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [{
      "type": "text",
      "text": "{\"templates\": [...]}"
    }]
  }
}
```

---

## Files Created

- `src/mcp-http-server.ts` - MCP over HTTP server
- `Dockerfile` - Updated to use MCP server
- `CHATGPT_MCP_SETUP.md` - This guide

---

## Support

**For ChatGPT connector issues**:
- OpenAI Help: https://help.openai.com/en/articles/11487775-connectors-in-chatgpt
- Community: https://community.openai.com/

**For WeSign MCP server issues**:
- Check logs: `docker-compose logs`
- Test health: `curl https://f1b9a644065e.ngrok-free.app/health`
- Verify ngrok: Check http://localhost:4040

---

**Status**: ✅ MCP HTTP Server Running
**Public URL**: https://f1b9a644065e.ngrok-free.app
**Next Action**: Add custom connector in ChatGPT Settings → Connectors