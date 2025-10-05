# WeSign MCP Server - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Build the Server

```bash
cd "C:\Users\gals\Desktop\wesign-mcp-server"
npm install  # If not already installed
npm run build
```

### Step 2: Configure Claude Code

Add this to your Claude Desktop config file (`%APPDATA%\Claude\claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "wesign": {
      "command": "node",
      "args": ["C:\\Users\\gals\\Desktop\\wesign-mcp-server\\dist\\index.js"],
      "env": {
        "WESIGN_API_URL": "https://wesign3.comda.co.il",
        "WESIGN_EMAIL": "your-email@example.com",
        "WESIGN_PASSWORD": "your-password"
      }
    }
  }
}
```

**Important:** Replace `your-email@example.com` and `your-password` with your actual WeSign credentials!

### Step 3: Restart Claude Desktop

Close and reopen Claude Desktop for the configuration to take effect.

### Step 4: Test It!

Open Claude Desktop and try these commands:

#### Test 1: Check Authentication
```
Check my WeSign authentication status
```

#### Test 2: Get User Info
```
Show me my WeSign account information
```

#### Test 3: List Documents
```
List my WeSign documents
```

#### Test 4: Create a Self-Sign Document
```
Create a self-sign document from C:\path\to\your\document.pdf
```

---

## 📖 Common Use Cases

### 1. Sign a Document Yourself

**User:** "I need to sign a contract PDF at C:\Users\gals\Desktop\contract.pdf"

**Claude will:**
1. Login (automatically)
2. Create self-sign document
3. Ask where you want signature fields
4. Complete the signing
5. Save the signed PDF

### 2. Send Document to Multiple Signers

**User:** "Send C:\Users\gals\Desktop\agreement.pdf to john@example.com and jane@example.com for signature"

**Claude will:**
1. Create a template from the document
2. Send to both signers via email
3. Return document collection ID for tracking

### 3. Create a Template

**User:** "Turn C:\Users\gals\Desktop\NDA.pdf into a reusable template called 'Standard NDA'"

**Claude will:**
1. Upload the document
2. Create template with the name
3. Return template ID for future use

### 4. Extract Signers from Excel

**User:** "Extract signer information from C:\Users\gals\Desktop\signers.xlsx"

**Claude will:**
1. Read the Excel file
2. Parse signer information
3. Return structured list of signers

---

## 🎯 All Available Commands

### Authentication
- "Login to WeSign"
- "Logout from WeSign"
- "Check WeSign auth status"
- "Refresh my WeSign token"

### Documents
- "Upload [file path] to WeSign"
- "List my WeSign documents"
- "Download document [ID]"
- "Get info about document [ID]"
- "Create document collection with [files]"

### Self-Signing
- "Create self-sign document from [file path]"
- "Add signature field to document [ID] at position (x, y)"
- "Complete signing for document [ID]"
- "Save draft for document [ID]"
- "Decline document [ID]"
- "Get signing status for document [ID]"

### Templates
- "Create template from [file path] named [name]"
- "List my templates"
- "Get template [ID] details"
- "Create document from template [ID]"

### Multi-Party Signing
- "Send [file path] to [signers] for signature"
- "Send simple document using template [ID] to [signer]"
- "Resend document [ID] to signer [ID]"
- "Replace signer [ID] in document [ID]"
- "Cancel document [ID]"
- "Reactivate document [ID]"
- "Share document [ID] with [emails]"
- "Get signing link for signer [ID] in document [ID]"

### User & Admin
- "Show my WeSign account info"
- "Update my WeSign profile"
- "Extract signers from [Excel file]"

---

## 🔍 Troubleshooting

### Issue: MCP server not appearing in Claude

**Solution:**
1. Verify the config file path is correct
2. Ensure JSON syntax is valid
3. Check that the `dist/index.js` file exists
4. Restart Claude Desktop completely

### Issue: Authentication failed

**Solution:**
1. Verify email and password are correct
2. Check API URL is `https://wesign3.comda.co.il`
3. Ensure account is active
4. Try logging in via WeSign website first

### Issue: File not found errors

**Solution:**
1. Use absolute paths (e.g., `C:\Users\...`)
2. Ensure file exists at the specified path
3. Check file permissions
4. Verify file format is supported (PDF, Word, Excel, images)

### Issue: Token expired

**Solution:**
- Claude will automatically refresh tokens
- If refresh fails, just say "Login to WeSign again"

---

## 📊 Server Status

### Check if Server is Running

Look for this in Claude Desktop logs:
```
WeSign MCP Server started
Attempting auto-login for [your-email]...
Auto-login successful
Logged in as: [Your Name] ([your-email])
```

### View Server Logs

Windows: `%APPDATA%\Claude\logs\`

Look for lines containing "WeSign" or "wesign"

---

## 💡 Pro Tips

### Tip 1: Auto-Login
The server automatically logs in on startup using credentials from config. You don't need to manually login!

### Tip 2: Template-Based Workflow
For multi-party signing, the server automatically creates templates. This is the correct WeSign workflow.

### Tip 3: Batch Operations
You can ask Claude to process multiple documents in one request:
```
"Sign all PDF files in C:\Users\gals\Desktop\contracts\"
```

### Tip 4: Excel Integration
Use Excel files to send documents to many signers:
```
"Extract signers from signers.xlsx and send contract.pdf to all of them"
```

---

## 🎓 Example Workflows

### Workflow 1: Complete Self-Sign Process

```
User: "I need to sign contract.pdf on my desktop"

Claude: I'll help you sign that contract. Let me:
1. Create a self-sign document from C:\Users\gals\Desktop\contract.pdf
2. Add a signature field at the bottom of page 1
3. Complete the signing process
4. Save the signed document

[Claude executes the tools]

Done! Your signed contract has been saved to C:\Users\gals\Desktop\contract-signed.pdf
```

### Workflow 2: Multi-Party Signing

```
User: "Send NDA.pdf to john@example.com and jane@example.com for signature"

Claude: I'll send the NDA for signatures. Let me:
1. Create a template from NDA.pdf
2. Send it to both signers via email
3. Add default signature fields for each signer

[Claude executes the tools]

Done! Document sent successfully:
- Document ID: [GUID]
- Template ID: [GUID]
- Status: Pending
- Signers:
  * John (john@example.com) - Pending
  * Jane (jane@example.com) - Pending
```

### Workflow 3: Template Management

```
User: "Create a template from employment-contract.pdf and use it for 3 new hires"

Claude: I'll create the template and generate documents. Let me:
1. Create template named "Employment Contract"
2. Create document for Hire 1
3. Create document for Hire 2
4. Create document for Hire 3

[Claude executes the tools]

Done! Created:
- Template: Employment Contract (ID: [GUID])
- Documents: 3 documents ready for signing
```

---

## 📞 Getting Help

### Built-in Help
Ask Claude: "What WeSign tools are available?"

### Documentation
- `README.md` - Full documentation
- `EXAMPLES.md` - Detailed examples
- `IMPLEMENTATION_STATUS.md` - Technical details

### Common Questions

**Q: Can I use this with multiple WeSign accounts?**
A: Yes, just change the email/password in the config and restart Claude Desktop.

**Q: What file formats are supported?**
A: PDF, Word (.doc, .docx), Excel (.xls, .xlsx), Images (.jpg, .png, .gif)

**Q: How do I track document status?**
A: Use "Get signing status for document [ID]" or "List my documents"

**Q: Can I cancel a document after sending?**
A: Yes, use "Cancel document [ID]"

---

## 🎉 You're Ready!

The WeSign MCP Server is now configured and ready to use. Start by asking Claude to check your authentication status or list your documents.

**Happy signing! 🚀**