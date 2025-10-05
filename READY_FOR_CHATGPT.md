# ✅ WeSign MCP Server - Ready for ChatGPT!

## 🎉 Your Server is Live and Public!

**Public URL**: `https://f1b9a644065e.ngrok-free.app`

✅ Docker container running on port 8080
✅ ngrok tunnel active and public
✅ WeSign authentication successful
✅ All 32 tools tested and working
✅ OpenAPI spec generated

---

## Quick Test (Verify It's Working)

### Test 1: Health Check
```bash
curl https://f1b9a644065e.ngrok-free.app/health
```
**Expected**: `{"status":"ok","authenticated":true,"timestamp":"..."}`

### Test 2: List Templates
```bash
curl -X POST https://f1b9a644065e.ngrok-free.app/execute \
  -H "Content-Type: application/json" \
  -d '{"tool":"wesign_list_templates","parameters":{"offset":0,"limit":5}}'
```
**Expected**: List of your WeSign templates

---

## Configure ChatGPT (Step-by-Step)

### Method 1: Using Custom GPT (Recommended)

1. **Go to ChatGPT**: https://chat.openai.com
2. **Create New GPT**: Click your profile → "Explore GPTs" → "Create"
3. **Configure**:
   - Name: "WeSign Assistant"
   - Description: "Digital signature and document management assistant"
   - Instructions: "You are a helpful assistant that can manage digital signatures and documents using WeSign. You can list templates, send documents for signature, check signing status, and manage user documents."

4. **Add Action**:
   - Click "Create new action"
   - Click "Import from URL" or paste the OpenAPI spec
   - File location: `C:\Users\gals\Desktop\wesign-mcp-server\chatgpt-openapi.yaml`
   - Or manually paste the spec content

5. **Test Connection**:
   - Click "Test" button
   - Should show "Connection successful"

6. **Save and Test**:
   - Click "Create" to save your GPT
   - Try: "List my WeSign templates"

### Method 2: Using ChatGPT Actions (ChatGPT Plus)

1. **Go to Settings**: ChatGPT → Settings → Beta Features
2. **Enable Actions**: Turn on "Actions"
3. **Create Action**:
   - Go to any chat
   - Type `/actions`
   - Click "Create new action"
   - Import `chatgpt-openapi.yaml`
4. **Test**: "List my WeSign templates"

---

## Example ChatGPT Prompts to Try

Once configured, try these:

### Templates
- "List my WeSign templates"
- "Show me all my document templates"
- "Get details about template [name]"

### Documents
- "Show my recent documents"
- "List all documents I've sent"
- "Check the status of document [name]"

### Sending Documents
- "Send contract.pdf to john@example.com for signature"
- "Send the NDA template to Jane at jane@company.com"
- "Create a signing request for sales-agreement.pdf to +1234567890"

### User Info
- "Show my WeSign account info"
- "How many documents can I send this month?"
- "What's my account status?"

---

## OpenAPI Spec Contents

The file `chatgpt-openapi.yaml` contains:

**Base URL**: `https://f1b9a644065e.ngrok-free.app`

**Endpoints**:
1. `POST /execute` - Execute any WeSign tool
2. `GET /health` - Health check
3. `GET /tools` - List all available tools

**Available Tools** (32 total):
- Authentication: login, logout, refresh_token, check_auth_status
- Templates: list, get, create, use, update_fields
- Documents: list, get, upload, create_collection, download
- Signing: send_for_signing, self_sign, add_fields, complete, decline
- Multi-party: send_for_signature, resend, replace_signer, cancel, reactivate
- User: get_info, update_info
- Utilities: share_document, get_signer_link, extract_signers

---

## Important Notes

### ngrok Session
- **URL is temporary**: Free ngrok URLs change when ngrok restarts
- **Keep ngrok running**: Don't close the ngrok terminal
- **View requests**: Go to http://localhost:4040 to see all incoming requests

### If ngrok Restarts
If you restart ngrok, you'll get a new URL:
1. Check new URL in ngrok logs
2. Update the OpenAPI spec with new URL
3. Re-import to ChatGPT

### Upgrade to ngrok Pro (Optional)
For a permanent URL:
- Sign up for ngrok Pro: https://dashboard.ngrok.com/billing
- Get a custom domain: `yourname.ngrok.io`
- URL never changes!

---

## File Upload Limitations

ChatGPT cannot directly access files on your computer. For sending documents:

### Option 1: Use Templates
- Create templates in WeSign web UI
- Use template ID in ChatGPT
- Example: "Send template abc123 to john@example.com"

### Option 2: Upload via WeSign Web UI
- Upload document through WeSign interface
- Use document ID in ChatGPT
- Example: "Send document def456 to jane@example.com"

### Option 3: Base64 Encoding (Advanced)
- Convert file to base64
- Paste base64 in ChatGPT message
- Use `wesign_upload_document` with base64

---

## Monitoring

### View Live Requests
Open in browser: http://localhost:4040

You'll see:
- All incoming requests from ChatGPT
- Request/response details
- Timing and status codes
- Perfect for debugging!

### View Container Logs
```bash
cd C:\Users\gals\Desktop\wesign-mcp-server
docker-compose logs -f
```

---

## Stopping/Restarting

### Stop ngrok
```bash
# Find ngrok process and kill it
tasklist | findstr ngrok
taskkill /F /IM ngrok.exe
```

### Restart Everything
```bash
# Restart Docker container
docker-compose restart

# Restart ngrok
cd C:\Users\gals\Desktop\wesign-mcp-server
ngrok.exe http 8080
```

---

## Security Recommendations

### For Production Use:

1. **Add API Key** (edit `docker-compose.yml`):
```yaml
environment:
  - API_KEY=your-secret-random-key-here
```

2. **Restrict CORS**:
```yaml
environment:
  - CORS_ORIGIN=https://chat.openai.com
```

3. **Use ngrok Pro**: Get permanent URL and more features

4. **Monitor Usage**: Check ngrok dashboard regularly

---

## Troubleshooting

### ChatGPT Says "Connection Failed"
1. Check ngrok is running: `tasklist | findstr ngrok`
2. Test health: `curl https://f1b9a644065e.ngrok-free.app/health`
3. Check container: `docker ps`

### ngrok URL Changed
1. Get new URL from ngrok logs
2. Update `chatgpt-openapi.yaml` with new URL
3. Re-import to ChatGPT

### Tool Execution Fails
1. Check logs: `docker-compose logs`
2. Test directly with curl
3. Verify WeSign credentials in `docker-compose.yml`

---

## What's Next?

🎯 **Ready to use!** Your ChatGPT can now:
- ✅ List and manage WeSign templates
- ✅ Send documents for signature
- ✅ Track document status
- ✅ Manage signers and recipients
- ✅ Access account information

🚀 **Try it now!**
1. Configure ChatGPT with the OpenAPI spec
2. Start chatting: "List my WeSign templates"
3. See the magic happen! ✨

---

## Support & Documentation

- **OpenAPI Spec**: `chatgpt-openapi.yaml`
- **All Tools**: `CHATGPT_CONFIG.md`
- **Docker Guide**: `DOCKER_QUICK_START.md`
- **Deployment**: `DEPLOYMENT_GUIDE.md`
- **Container Status**: `CONTAINER_DEPLOYED.md`

---

**Status**: ✅ Production Ready
**Public URL**: https://f1b9a644065e.ngrok-free.app
**Deployment Date**: 2025-09-30
**Next Action**: Configure ChatGPT and start using!