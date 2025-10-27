# 🎨 WeSign for ChatGPT - Visual Setup Guide

Your WeSign MCP server now includes **stunning visual widgets** that render beautifully in ChatGPT!

## ✨ What's New

### Beautiful Visual Responses
Every tool now returns rich, interactive HTML widgets with:
- 🎨 **Modern gradients** and glass-morphism effects
- 📊 **Live dashboards** with usage statistics
- 📱 **Responsive design** that looks great on any device
- ⚡ **Smooth animations** and transitions
- 🎭 **Status badges** and progress indicators

## 🚀 Quick Start

### Step 1: Start Your Server

```bash
cd /c/Users/gals/Desktop/wesign-mcp-server

# Option 1: Using Docker (Recommended)
docker-compose up -d

# Option 2: Direct Node.js
export WESIGN_API_URL="https://devtest.comda.co.il"
export WESIGN_EMAIL="your-email@example.com"
export WESIGN_PASSWORD="your-password"
npm run build
node dist/mcp-http-server.js
```

### Step 2: Expose with ngrok

```bash
# If ngrok is not running
./ngrok.exe http 8080
```

**Note your public URL**, e.g.: `https://abc123.ngrok-free.app`

### Step 3: Add to ChatGPT

1. Open ChatGPT: https://chat.openai.com
2. Click your **profile picture** → **Settings**
3. Navigate to **"Connectors"** (or **"Beta features"** → **"Plugins"**)
4. Click **"Add custom connector"** or **"Develop your own connector"**
5. Fill in:
   - **Name**: `WeSign`
   - **Description**: `Digital signature platform with beautiful visual dashboards`
   - **Server URL**: `https://YOUR-NGROK-URL.ngrok-free.app/mcp`
   - **Protocol**: `MCP` (Model Context Protocol)
   - **Transport**: `HTTP`
6. Click **"Test connection"** ✅
7. **Save** and **Enable**

## 🎯 Example Prompts

Once configured, try these prompts in ChatGPT:

### Dashboard & Account
```
"Show me my WeSign account dashboard"
"What's my document usage this month?"
"Am I authenticated with WeSign?"
```

### Document Management
```
"Show my recent documents with a beautiful gallery"
"List all my pending documents"
"What's the status of my documents?"
```

### Templates
```
"Display all my templates in a showcase"
"How many templates do I have?"
"Show template details for [name]"
```

### Signing Workflows
```
"Send contract.pdf to john@example.com for signature"
"Create a self-sign document from template.pdf"
"What are the steps to sign a document?"
```

## 🎨 Visual Features

### 1. Account Dashboard Widget
- **Beautiful gradient background** (purple to violet)
- **User profile card** with company info
- **Usage statistics** with animated progress bars
- **Real-time status** indicators

**Example Response**:
When you ask "Show my account dashboard", you'll see:
- ✅ User name, email, company
- 📊 Documents used vs. remaining
- 📈 Usage percentage with visual progress bar
- 🔐 Active session indicator with pulse animation

### 2. Documents Gallery
- **Grid layout** of all your documents
- **Status badges** (Draft, Pending, Completed, Cancelled)
- **Hover effects** with shadow animations
- **Color-coded statuses**

**Example Response**:
"Show my documents" displays:
- 📄 Document cards with icons
- 🗓️ Creation dates
- 🎯 File counts
- 🏷️ Color-coded status badges

### 3. Templates Showcase
- **Modern card design** with usage metrics
- **Template descriptions** and metadata
- **Usage counters** for each template
- **Interactive hover states**

**Example Response**:
"Display my templates" shows:
- 📝 Template cards with icons
- 📊 Usage statistics per template
- 📅 Creation dates
- 🆔 Template IDs for reference

### 4. Success Animations
- **Animated checkmarks** when operations succeed
- **Smooth fade-in** transitions
- **Success messages** with document names
- **Green gradient** backgrounds for positive feedback

**Example Response**:
After "Sign document.pdf", you'll see:
- ✓ Large animated checkmark
- 🎉 "Signature Complete!" message
- 📄 Document name display
- 💚 Beautiful green success background

## 🛠️ Advanced Configuration

### Enable Visual Responses for All Tools

The server automatically detects when ChatGPT requests responses and formats them beautifully.

**No additional configuration needed!** 🎉

### Custom Styling (Optional)

Want to customize the visual theme? Edit:
```
/src/utils/visual-formatter.ts
/src/widgets/dashboard-widgets.ts
```

Change colors, fonts, animations to match your brand.

## 📊 Visual Response Types

### ✅ Success Responses
- Green gradient background
- Animated checkmark
- Clear success message
- Operation details

### ⚠️ Error Responses
- Red gradient background
- Warning icon
- Error description
- Helpful hints and suggestions

### 📋 List Responses
- Card-based layouts
- Sortable items
- Status indicators
- Metadata display

### 📈 Dashboard Responses
- Statistical overviews
- Progress bars
- Usage charts
- Real-time data

## 🔧 Troubleshooting

### Visual widgets not showing in ChatGPT?

**Solution 1**: Check your ChatGPT plan
- Custom connectors with rich visuals require **ChatGPT Plus** or higher
- Free accounts have limited connector support

**Solution 2**: Verify server is running
```bash
curl http://localhost:8080/health
```

Expected response:
```json
{
  "status": "ok",
  "authenticated": true,
  "protocol": "MCP HTTP"
}
```

**Solution 3**: Test ngrok connection
```bash
curl https://YOUR-NGROK-URL.ngrok-free.app/health
```

### Colors look different in ChatGPT?

ChatGPT may apply its own theme filters. The widgets are designed to work well in both light and dark modes.

## 🎓 How It Works

### Visual Rendering Pipeline

1. **Tool Execution**: You ask ChatGPT a question
2. **MCP Request**: ChatGPT sends request to your server via MCP protocol
3. **Visual Formatter**: Server generates beautiful HTML response
4. **Widget Rendering**: ChatGPT renders the HTML inline
5. **Interactive Display**: You see the stunning visual result!

### Technologies Used

- **HTML5 + CSS3**: Modern web standards
- **Gradient Backgrounds**: Eye-catching color schemes
- **Flexbox/Grid**: Responsive layouts
- **CSS Animations**: Smooth transitions
- **Glass-morphism**: Backdrop blur effects
- **Custom Typography**: Apple system fonts

## 📱 Mobile Support

All widgets are fully responsive and look great on:
- 📱 Mobile phones (iPhone, Android)
- 📱 Tablets (iPad, etc.)
- 💻 Desktops (any size)

## 🌐 Browser Compatibility

Tested and working on:
- ✅ Chrome/Edge (Chromium)
- ✅ Safari
- ✅ Firefox
- ✅ Opera

## 🔒 Security Notes

- All visual responses are **read-only**
- No JavaScript execution in widgets
- No external resource loading
- No tracking or analytics
- **100% secure** HTML/CSS only

## 🎯 Best Practices

### DO:
- ✅ Use descriptive prompts: "Show my account dashboard"
- ✅ Ask for specific data: "List templates with usage > 10"
- ✅ Request visual formats: "Display in gallery view"

### DON'T:
- ❌ Ask for file downloads in chat (use proper tools)
- ❌ Expect real-time updates (refresh with new prompts)
- ❌ Mix multiple unrelated requests in one prompt

## 📚 API Reference

### Visual Widgets Available

| Widget | Trigger | Description |
|--------|---------|-------------|
| Account Dashboard | `wesign_get_user_info` | User profile + usage stats |
| Documents Gallery | `wesign_list_documents` | Grid of document cards |
| Templates Showcase | `wesign_list_templates` | Template cards with metrics |
| Success Animation | Any successful operation | Animated success feedback |
| Error Display | Any failed operation | Clear error with hints |

## 🚀 Next Steps

1. ✅ Server is running with visuals enabled
2. ✅ Ngrok is exposing your server
3. ✅ ChatGPT connector is configured
4. ✅ Try the example prompts above!

## 💡 Pro Tips

### Tip 1: Combine Multiple Views
```
"Show my account dashboard and recent documents"
```
ChatGPT will call multiple tools and display multiple widgets!

### Tip 2: Filter Results
```
"Show only completed documents"
"List templates created this month"
```
The visual responses will reflect your filters.

### Tip 3: Use Natural Language
```
"What's my document quota?"
"How many signatures have I sent?"
```
ChatGPT understands natural language and calls the right visual tools.

## 🎉 Enjoy Your Beautiful WeSign Experience!

Your digital signature platform now has a world-class visual interface in ChatGPT!

Questions? Issues? Check the [main README](./README.md) or [CHATGPT_MCP_SETUP.md](./CHATGPT_MCP_SETUP.md).

---

**Made with ❤️ for ChatGPT** • WeSign Visual Edition • v2.0
