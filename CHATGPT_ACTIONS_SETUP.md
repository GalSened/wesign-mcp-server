# 🎯 WeSign for ChatGPT - Custom GPT Actions Setup

Your WeSign server is running! For ChatGPT integration, use **Custom GPT with Actions** instead of MCP connectors.

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create a Custom GPT

1. Go to https://chat.openai.com
2. Click **"Explore"** (left sidebar)
3. Click **"Create a GPT"** (top right)
4. Click **"Configure"** tab

### Step 2: Configure Your GPT

**Name:** `WeSign Assistant`

**Description:**
```
Digital signature platform with beautiful visual dashboards. Manage documents, templates, and signatures with ease.
```

**Instructions:**
```
You are a WeSign assistant that helps users manage digital signatures and documents.

When users ask about their account, documents, or templates, use the available actions to fetch data and present it in a clear, organized way.

For visual requests like "show dashboard" or "display gallery", describe the data in a structured, visually appealing format.

Always be helpful and explain what actions you're taking.
```

**Conversation starters:**
```
Show me my account dashboard
List my recent documents
Display all my templates
What's my document usage?
```

### Step 3: Add Actions

1. Scroll down to **"Actions"** section
2. Click **"Create new action"**
3. Click **"Import from URL"**
4. Paste this URL:
```
https://936da9734e85.ngrok-free.app/openapi-chatgpt.yaml
```
5. Click **"Import"**

**OR** manually paste the OpenAPI spec:

Click **"Edit"** and paste:
```yaml
openapi: 3.1.0
info:
  title: WeSign Digital Signature API
  version: 2.0.0
servers:
  - url: https://936da9734e85.ngrok-free.app

paths:
  /execute:
    post:
      operationId: executeWeSignTool
      summary: Execute WeSign tool
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [tool]
              properties:
                tool:
                  type: string
                parameters:
                  type: object
      responses:
        '200':
          description: Success
```

### Step 4: Test & Publish

1. Click **"Test"** in the Actions section
2. Try: `{"tool": "wesign_get_user_info", "parameters": {}}`
3. Should return your account info ✅
4. Click **"Create"** (top right)
5. Set visibility: "Only me" or "Anyone with link"

## 🎨 Try These Prompts

In your Custom GPT:

```
"Show me my WeSign account dashboard"
"Display my recent documents"
"List all my templates"
"What's my document usage this month?"
"Search for documents created this week"
```

## 📊 Available Tools

Your Custom GPT can now call these tools:

### Account & Auth
- `wesign_check_auth_status` - Check authentication
- `wesign_get_user_info` - Get account info with usage stats

### Documents
- `wesign_list_documents` - List all documents
- `wesign_search_documents` - Search with filters
- `wesign_get_document_info` - Get document details
- `wesign_upload_document` - Upload files (requires file path)

### Templates
- `wesign_list_templates` - List all templates
- `wesign_get_template` - Get template details
- `wesign_create_template` - Create new template

### Sending
- `wesign_send_document_for_signing` - Quick send workflow

## 🎯 Example Conversation

**You:** "Show me my account dashboard"

**WeSign Assistant:** "Let me fetch your account information..."

[Calls `wesign_get_user_info`]

**WeSign Assistant:**
```
📊 Your WeSign Dashboard

👤 Account Information
• Name: Updated User Name
• Email: nirk@comsign.co.il
• Company: Nir Company
• Role: Company Admin

📈 Usage Statistics
• Documents Remaining: Unlimited
• Subscription: Active until 2044-01-01
• Language: Hebrew (RTL)

✅ Status: Authenticated and Active
```

---

## 🆘 Alternative: Use REST API Directly

If Custom GPT Actions don't work, you can use the REST endpoint directly:

### Test Endpoint

```bash
curl -X POST https://936da9734e85.ngrok-free.app/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "wesign_get_user_info",
    "parameters": {}
  }'
```

### Response
```json
{
  "success": true,
  "data": {
    "user": {
      "name": "Updated User Name",
      "email": "nirk@comsign.co.il",
      "company": "Nir Company"
    }
  }
}
```

---

## 📚 Full Tool List

All 34 tools available via `/execute` endpoint:

**Authentication:** login, logout, refresh_token, check_auth_status

**Documents:** upload, create_collection, list, get_info, download, search, merge

**Templates:** create, list, get, use, update_fields

**Self-Signing:** create_self_sign, add_signature_fields, complete_signing, save_draft, decline, get_status

**Multi-Party:** send_for_signature, send_simple, resend, replace_signer, cancel, reactivate, share, get_signer_link

**Contacts:** create, list, get, update, delete (+ groups)

---

## 🔒 Security

- ✅ Authentication handled automatically
- ✅ All connections over HTTPS
- ✅ No credentials exposed to ChatGPT
- ✅ Server authenticates on startup

---

## 💡 Pro Tips

1. **Natural Language**: Ask questions naturally
2. **Be Specific**: "Show documents from this week"
3. **Combine Requests**: "Show dashboard and list templates"
4. **Use Filters**: "Only completed documents"

---

## 🎉 You're Ready!

Your WeSign server is accessible at:
```
https://936da9734e85.ngrok-free.app/execute
```

OpenAPI spec available at:
```
https://936da9734e85.ngrok-free.app/openapi-chatgpt.yaml
```

**Create your Custom GPT and start using WeSign in ChatGPT!** 🚀
