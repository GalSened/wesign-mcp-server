import express from 'express';
import cors from 'cors';
import { WeSignClient } from './wesign-client.js';
import { AuthTools } from './tools/auth-tools.js';
import { DocumentTools } from './tools/document-tools.js';
import { SigningTools } from './tools/signing-tools.js';
import { TemplateAdminTools } from './tools/template-admin-tools.js';
import { MultiPartyTools } from './tools/multi-party-tools.js';

const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// API Key authentication (optional)
const API_KEY = process.env.API_KEY;
if (API_KEY) {
  app.use((req, res, next) => {
    if (req.path === '/health') return next();

    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
  });
}

// Initialize WeSign client
const config = {
  apiUrl: process.env.WESIGN_API_URL || 'https://wse.comsigntrust.com',
  email: process.env.WESIGN_EMAIL,
  password: process.env.WESIGN_PASSWORD,
  persistent: process.env.WESIGN_PERSISTENT === 'true'
};

const client = new WeSignClient(config);
const authTools = new AuthTools(client);
const documentTools = new DocumentTools(client);
const signingTools = new SigningTools(client);
const templateAdminTools = new TemplateAdminTools(client);
const multiPartyTools = new MultiPartyTools(client);

// Auto-login if credentials provided
if (config.email && config.password) {
  client.login(config.email, config.password, config.persistent || false)
    .then(() => {
      console.log('Auto-login successful');
    })
    .catch((error) => {
      console.error('Auto-login failed:', error.message);
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    authenticated: client.isAuthenticated(),
    timestamp: new Date().toISOString()
  });
});

// List all available tools
app.get('/tools', (req, res) => {
  const allTools = [
    ...authTools.getTools(),
    ...documentTools.getTools(),
    ...signingTools.getTools(),
    ...templateAdminTools.getTools(),
    ...templateAdminTools.getSimpleTools(),
    ...multiPartyTools.getTools()
  ];

  res.json({
    success: true,
    count: allTools.length,
    tools: allTools.map(t => ({
      name: t.name,
      description: t.description
    }))
  });
});

// Execute tool endpoint
app.post('/execute', async (req, res) => {
  try {
    const { tool, parameters } = req.body;

    if (!tool) {
      return res.status(400).json({
        success: false,
        error: 'Tool name is required'
      });
    }

    // Auto-login if not authenticated
    if (!client.isAuthenticated() && config.email && config.password) {
      await client.login(config.email, config.password, config.persistent || false);
    }

    let result;

    // Route to appropriate tool handler
    if (tool.startsWith('wesign_login') || tool.startsWith('wesign_logout') || tool.startsWith('wesign_refresh')) {
      result = await authTools.executeAuthTool(tool, parameters || {});
    }
    else if (tool.startsWith('wesign_upload') || tool.startsWith('wesign_create_document') ||
      tool.startsWith('wesign_get_document') || tool.startsWith('wesign_list_documents') ||
      tool.startsWith('wesign_download')) {
      result = await documentTools.executeDocumentTool(tool, parameters || {});
    }
    else if (tool.startsWith('wesign_create_self') || tool.startsWith('wesign_add_signature') ||
      tool.startsWith('wesign_complete_signing') || tool.startsWith('wesign_save_draft') ||
      tool.startsWith('wesign_decline_document') || tool.startsWith('wesign_get_signing_status')) {
      result = await signingTools.executeSigningTool(tool, parameters || {});
    }
    else if (tool.startsWith('wesign_create_template') || tool.startsWith('wesign_list_templates') ||
      tool.startsWith('wesign_get_template') || tool.startsWith('wesign_use_template') ||
      tool.startsWith('wesign_update_template') || tool.startsWith('wesign_get_user') ||
      tool.startsWith('wesign_update_user') || tool.startsWith('wesign_extract_signers') ||
      tool.startsWith('wesign_check_auth') || tool.startsWith('wesign_send_document_for_signing')) {
      result = await templateAdminTools.executeTemplateAdminTool(tool, parameters || {});
    }
    else if (tool.startsWith('wesign_send_for_signature') || tool.startsWith('wesign_send_simple') ||
      tool.startsWith('wesign_resend') || tool.startsWith('wesign_replace_signer') ||
      tool.startsWith('wesign_cancel') || tool.startsWith('wesign_reactivate') ||
      tool.startsWith('wesign_share') || tool.startsWith('wesign_get_signer')) {
      result = await multiPartyTools.executeMultiPartyTool(tool, parameters || {});
    }
    else {
      return res.status(404).json({
        success: false,
        error: `Unknown tool: ${tool}`
      });
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Tool execution error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Tool execution failed'
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`WeSign MCP Server listening on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Tools list: http://localhost:${PORT}/tools`);
  console.log(`Execute endpoint: http://localhost:${PORT}/execute`);
});