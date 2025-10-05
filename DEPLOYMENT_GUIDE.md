# WeSign MCP Server - Deployment Guide for ChatGPT Integration

## Overview

For ChatGPT/OpenAI to access the WeSign MCP server, it must be deployed as a **publicly accessible web service** with an HTTP/HTTPS endpoint, not running locally on your machine.

## Deployment Options

### Option 1: Cloud Hosting with API Gateway (Recommended)

Deploy the MCP server on a cloud platform and expose it via REST API.

#### Platforms:
- **AWS Lambda + API Gateway**
- **Google Cloud Run**
- **Azure Functions**
- **Heroku**
- **DigitalOcean App Platform**
- **Railway.app**
- **Render.com**

#### Architecture:
```
ChatGPT → HTTPS → API Gateway → MCP Server → WeSign API
```

---

### Option 2: VPS/Dedicated Server

Deploy on a Virtual Private Server with a reverse proxy.

#### Platforms:
- **AWS EC2**
- **Google Cloud Compute Engine**
- **DigitalOcean Droplet**
- **Linode**
- **Vultr**

#### Architecture:
```
ChatGPT → HTTPS → Nginx/Apache → MCP Server (Node.js) → WeSign API
```

---

### Option 3: Serverless Functions

Convert MCP tools to individual serverless functions.

#### Platforms:
- **Vercel Functions**
- **Netlify Functions**
- **Cloudflare Workers**

#### Architecture:
```
ChatGPT → HTTPS → Serverless Function → WeSign API
```

---

## Recommended: AWS Lambda + API Gateway Setup

### Step 1: Prepare the Code for Lambda

Create a new file `lambda-handler.js`:

```javascript
const { WeSignClient } = require('./dist/wesign-client.js');

// Initialize WeSign client
const client = new WeSignClient({
  apiUrl: process.env.WESIGN_API_URL
});

// Lambda handler
exports.handler = async (event) => {
  try {
    const { tool, parameters } = JSON.parse(event.body);

    // Authenticate if not already
    if (!client.isAuthenticated()) {
      await client.login(
        process.env.WESIGN_EMAIL,
        process.env.WESIGN_PASSWORD
      );
    }

    // Route to appropriate tool
    let result;
    switch (tool) {
      case 'wesign_login':
        result = await client.login(parameters.email, parameters.password);
        break;

      case 'wesign_list_templates':
        result = await client.getTemplates(parameters.offset, parameters.limit);
        break;

      case 'wesign_list_documents':
        result = await client.getDocumentCollections(parameters.offset, parameters.limit);
        break;

      case 'wesign_get_user_info':
        result = await client.getCurrentUser();
        break;

      // Add more tool cases here...

      default:
        throw new Error(`Unknown tool: ${tool}`);
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: result
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        error: error.message
      })
    };
  }
};
```

### Step 2: Create Deployment Package

```bash
# Install production dependencies
npm install --production

# Create deployment package
zip -r wesign-lambda.zip . -x "*.git*" "node_modules/aws-sdk/*"
```

### Step 3: Deploy to AWS Lambda

```bash
# Using AWS CLI
aws lambda create-function \
  --function-name wesign-mcp-server \
  --runtime nodejs18.x \
  --handler lambda-handler.handler \
  --zip-file fileb://wesign-lambda.zip \
  --role arn:aws:iam::YOUR_ACCOUNT:role/lambda-execution-role \
  --environment Variables="{WESIGN_API_URL=https://devtest.comda.co.il,WESIGN_EMAIL=your-email,WESIGN_PASSWORD=your-password}" \
  --timeout 30 \
  --memory-size 512
```

### Step 4: Create API Gateway

```bash
# Create REST API
aws apigateway create-rest-api \
  --name "WeSign MCP API" \
  --description "WeSign MCP Server for ChatGPT"

# Create resource and method
# ... (configure POST method to Lambda)

# Deploy API
aws apigateway create-deployment \
  --rest-api-id YOUR_API_ID \
  --stage-name prod
```

**Result**: You'll get a URL like:
```
https://abc123.execute-api.us-east-1.amazonaws.com/prod/wesign
```

---

## Alternative: Docker + Cloud Run (Google Cloud)

### Step 1: Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start server
CMD ["node", "dist/server.js"]
```

### Step 2: Create Express Server (`src/server.ts`)

```typescript
import express from 'express';
import { WeSignClient } from './wesign-client.js';

const app = express();
app.use(express.json());

const client = new WeSignClient({
  apiUrl: process.env.WESIGN_API_URL!
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Tool execution endpoint
app.post('/execute', async (req, res) => {
  try {
    const { tool, parameters } = req.body;

    // Auto-login if needed
    if (!client.isAuthenticated()) {
      await client.login(
        process.env.WESIGN_EMAIL!,
        process.env.WESIGN_PASSWORD!
      );
    }

    let result;
    switch (tool) {
      case 'wesign_login':
        result = await client.login(parameters.email, parameters.password);
        break;
      case 'wesign_list_templates':
        result = await client.getTemplates(parameters.offset, parameters.limit);
        break;
      // ... add more tools
      default:
        throw new Error(`Unknown tool: ${tool}`);
    }

    res.json({ success: true, data: result });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`WeSign MCP Server listening on port ${PORT}`);
});
```

### Step 3: Deploy to Google Cloud Run

```bash
# Build and push Docker image
docker build -t gcr.io/YOUR_PROJECT/wesign-mcp .
docker push gcr.io/YOUR_PROJECT/wesign-mcp

# Deploy to Cloud Run
gcloud run deploy wesign-mcp \
  --image gcr.io/YOUR_PROJECT/wesign-mcp \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars WESIGN_API_URL=https://devtest.comda.co.il \
  --set-env-vars WESIGN_EMAIL=your-email \
  --set-env-vars WESIGN_PASSWORD=your-password
```

**Result**: You'll get a URL like:
```
https://wesign-mcp-xyz123.run.app
```

---

## Simplest Option: Heroku Deployment

### Step 1: Create `Procfile`

```
web: node dist/server.js
```

### Step 2: Deploy

```bash
# Login to Heroku
heroku login

# Create app
heroku create wesign-mcp-server

# Set environment variables
heroku config:set WESIGN_API_URL=https://devtest.comda.co.il
heroku config:set WESIGN_EMAIL=your-email
heroku config:set WESIGN_PASSWORD=your-password

# Deploy
git push heroku main
```

**Result**: You'll get a URL like:
```
https://wesign-mcp-server.herokuapp.com
```

---

## ChatGPT Integration (OpenAI Custom Actions)

Once deployed, configure ChatGPT to use your server:

### Step 1: Create OpenAPI Spec (`openapi.yaml`)

```yaml
openapi: 3.0.0
info:
  title: WeSign MCP Server API
  version: 1.0.0
  description: Digital signature and document management via WeSign

servers:
  - url: https://your-deployed-server.com
    description: Production server

paths:
  /execute:
    post:
      summary: Execute WeSign tool
      operationId: executeTool
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                tool:
                  type: string
                  description: Tool name to execute
                  example: "wesign_list_templates"
                parameters:
                  type: object
                  description: Tool parameters
                  example: { "offset": 0, "limit": 50 }
              required:
                - tool
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object

components:
  securitySchemes:
    apiKey:
      type: apiKey
      in: header
      name: X-API-Key

security:
  - apiKey: []
```

### Step 2: Configure in ChatGPT

1. Go to ChatGPT settings
2. Navigate to "Actions" or "Custom GPTs"
3. Click "Create new action"
4. Import the OpenAPI spec
5. Set authentication (API key if you added one)
6. Test the connection

### Example ChatGPT Prompt After Setup:

```
"List my WeSign templates"
"Send contract.pdf to john@example.com for signature"
"Get my WeSign account information"
```

---

## Security Considerations

### 1. API Authentication

Add API key authentication to your server:

```typescript
const API_KEY = process.env.API_KEY;

app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});
```

### 2. Rate Limiting

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/execute', limiter);
```

### 3. CORS Configuration

```typescript
import cors from 'cors';

app.use(cors({
  origin: ['https://chat.openai.com'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type', 'X-API-Key']
}));
```

### 4. Environment Variables

Never hardcode credentials. Always use environment variables:

```bash
# .env file (never commit this!)
WESIGN_API_URL=https://devtest.comda.co.il
WESIGN_EMAIL=your-email@example.com
WESIGN_PASSWORD=your-secure-password
API_KEY=your-random-api-key-here
```

---

## File Upload Handling

For file uploads (PDFs, documents), you'll need to handle base64 encoding:

### Option A: Direct Upload

ChatGPT sends file as base64 in request:

```typescript
app.post('/execute', async (req, res) => {
  const { tool, parameters } = req.body;

  if (tool === 'wesign_upload_document') {
    // parameters.fileBase64 contains the base64 file
    // parameters.fileName contains the filename

    const result = await client.createDocumentCollection(
      parameters.fileName,
      [parameters.fileBase64]
    );

    return res.json({ success: true, data: result });
  }
});
```

### Option B: Cloud Storage

Use S3/GCS for temporary file storage:

```typescript
// User uploads to S3 first
// ChatGPT sends S3 URL
// Server downloads from S3
// Server uploads to WeSign
```

---

## Monitoring & Logging

### CloudWatch (AWS)

```typescript
import { CloudWatch } from 'aws-sdk';

const cloudwatch = new CloudWatch();

async function logMetric(metricName: string, value: number) {
  await cloudwatch.putMetricData({
    Namespace: 'WeSignMCP',
    MetricData: [{
      MetricName: metricName,
      Value: value,
      Unit: 'Count'
    }]
  }).promise();
}
```

### Application Logs

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

logger.info('Tool executed', { tool, parameters });
```

---

## Cost Estimates

### AWS Lambda + API Gateway
- **Free tier**: 1M requests/month, 400,000 GB-seconds compute
- **After free tier**: ~$0.20 per 1M requests
- **Storage**: ~$0.023/GB-month

### Google Cloud Run
- **Free tier**: 2M requests/month, 360,000 vCPU-seconds
- **After free tier**: ~$0.40 per 1M requests
- **Minimum**: $0 if unused

### Heroku
- **Free tier**: Discontinued
- **Hobby**: $7/month (sleeps after 30 min inactivity)
- **Standard**: $25-50/month (never sleeps)

---

## Quick Start: Railway.app (Easiest)

Railway.app is the easiest deployment option:

1. **Sign up**: https://railway.app
2. **Connect GitHub**: Link your repository
3. **Deploy**: One-click deploy
4. **Set Variables**: Add WESIGN_API_URL, WESIGN_EMAIL, WESIGN_PASSWORD
5. **Get URL**: Railway provides public URL automatically

**Cost**: Pay-as-you-go, ~$5/month for light usage

---

## Testing Your Deployment

### cURL Test

```bash
curl -X POST https://your-server.com/execute \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{
    "tool": "wesign_list_templates",
    "parameters": {
      "offset": 0,
      "limit": 10
    }
  }'
```

### Postman Test

Import this collection to test all endpoints:

```json
{
  "info": {
    "name": "WeSign MCP Server",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/"
  },
  "item": [
    {
      "name": "List Templates",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/execute",
        "header": [
          { "key": "X-API-Key", "value": "{{api_key}}" }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"tool\": \"wesign_list_templates\",\n  \"parameters\": {\n    \"offset\": 0,\n    \"limit\": 50\n  }\n}"
        }
      }
    }
  ]
}
```

---

## Next Steps

1. ✅ Choose deployment platform
2. ✅ Create server wrapper (Express/Lambda handler)
3. ✅ Deploy to cloud
4. ✅ Test with cURL/Postman
5. ✅ Create OpenAPI spec
6. ✅ Configure ChatGPT custom action
7. ✅ Test with ChatGPT

---

## Support

For deployment issues:
- **AWS**: https://docs.aws.amazon.com/lambda
- **Google Cloud**: https://cloud.google.com/run/docs
- **Railway**: https://docs.railway.app

For WeSign MCP Server issues:
- **GitHub**: Create issue in repository
- **Email**: support@example.com

---

## License

MIT License

---

## Version

Deployment Guide v1.0.0 - 2025-09-30