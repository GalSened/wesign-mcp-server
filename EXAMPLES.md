# WeSign MCP Server - Usage Examples

This document provides practical examples of how to use the WeSign MCP Server with AI assistants like Claude.

## Setup

First, configure your environment variables or Claude Desktop settings:

```json
{
  "mcpServers": {
    "wesign": {
      "command": "npx",
      "args": ["wesign-mcp-server"],
      "env": {
        "WESIGN_API_URL": "https://wesign3.comda.co.il",
        "WESIGN_EMAIL": "your-email@example.com",
        "WESIGN_PASSWORD": "your-password"
      }
    }
  }
}
```

## Basic Examples

### 1. Simple Document Signing

**User:** "Please help me sign this contract PDF at /home/user/contract.pdf"

**AI Response using MCP tools:**

1. Login (if not auto-configured):
```json
{
  "tool": "wesign_login",
  "args": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

2. Create self-sign document:
```json
{
  "tool": "wesign_create_self_sign",
  "args": {
    "filePath": "/home/user/contract.pdf",
    "name": "Employment Contract"
  }
}
```

3. Add signature field:
```json
{
  "tool": "wesign_add_signature_fields",
  "args": {
    "documentCollectionId": "12345678-1234-1234-1234-123456789012",
    "documentId": "87654321-4321-4321-4321-210987654321",
    "fields": [
      {
        "x": 100,
        "y": 650,
        "width": 200,
        "height": 50,
        "pageNumber": 1,
        "fieldType": 1
      }
    ]
  }
}
```

4. Complete signing:
```json
{
  "tool": "wesign_complete_signing",
  "args": {
    "documentCollectionId": "12345678-1234-1234-1234-123456789012",
    "documentId": "87654321-4321-4321-4321-210987654321",
    "savePath": "/home/user/signed-contract.pdf"
  }
}
```

### 2. Creating a Template

**User:** "Turn my NDA document into a reusable template"

```json
{
  "tool": "wesign_create_template",
  "args": {
    "filePath": "/home/user/documents/NDA-template.pdf",
    "name": "Standard NDA Template",
    "description": "Non-disclosure agreement template for clients"
  }
}
```

### 3. Bulk Document Processing

**User:** "I have an Excel file with 50 signers. Please extract their information."

```json
{
  "tool": "wesign_extract_signers_from_excel",
  "args": {
    "filePath": "/home/user/signers-list.xlsx"
  }
}
```

## Advanced Workflows

### 1. Document Review and Approval Process

**User:** "I need to set up a document that requires multiple signatures in a specific order"

1. Upload document:
```json
{
  "tool": "wesign_upload_document",
  "args": {
    "filePath": "/path/to/agreement.pdf",
    "name": "Partnership Agreement"
  }
}
```

2. Check document info:
```json
{
  "tool": "wesign_get_document_info",
  "args": {
    "documentCollectionId": "doc-collection-id"
  }
}
```

3. Monitor signing status:
```json
{
  "tool": "wesign_get_signing_status",
  "args": {
    "documentCollectionId": "doc-collection-id"
  }
}
```

### 2. Template-Based Document Generation

**User:** "Create 10 employment contracts from my template for new hires"

1. List available templates:
```json
{
  "tool": "wesign_list_templates",
  "args": {
    "limit": 20
  }
}
```

2. Use template to create document:
```json
{
  "tool": "wesign_use_template",
  "args": {
    "templateId": "template-id-here",
    "documentName": "Employment Contract - John Doe"
  }
}
```

3. Repeat for each new hire...

### 3. User Account Management

**User:** "Show me my account information and update my phone number"

1. Get current user info:
```json
{
  "tool": "wesign_get_user_info",
  "args": {}
}
```

2. Update user information:
```json
{
  "tool": "wesign_update_user_info",
  "args": {
    "name": "John Smith",
    "email": "john.smith@company.com",
    "phone": "+1-555-123-4567",
    "language": 1
  }
}
```

## Error Handling Examples

### Authentication Issues

**Scenario:** Token expired during operation

```json
{
  "tool": "wesign_refresh_token",
  "args": {}
}
```

If refresh fails, re-login:
```json
{
  "tool": "wesign_login",
  "args": {
    "email": "user@example.com",
    "password": "newpassword"
  }
}
```

### File Issues

**Scenario:** File not found error

**AI Response:** "I'll check the file path and provide alternatives..."

1. Verify auth status first:
```json
{
  "tool": "wesign_check_auth_status",
  "args": {}
}
```

2. List available documents:
```json
{
  "tool": "wesign_list_documents",
  "args": {
    "limit": 10
  }
}
```

## Complex Use Cases

### 1. Multi-Document Signing Session

**User:** "I have 5 contracts that need the same signature fields. Process them all."

```javascript
// Pseudo-code showing the workflow
const documents = [
  "/path/contract1.pdf",
  "/path/contract2.pdf",
  "/path/contract3.pdf",
  "/path/contract4.pdf",
  "/path/contract5.pdf"
];

const signatureFields = [
  { x: 100, y: 650, width: 200, height: 50, pageNumber: 1, fieldType: 1 },
  { x: 300, y: 200, width: 100, height: 30, pageNumber: 2, fieldType: 4 } // Date field
];

for (let doc of documents) {
  // 1. Create self-sign document
  // 2. Add signature fields
  // 3. Complete signing
  // 4. Download signed version
}
```

### 2. Template Management System

**User:** "Help me organize my document templates"

1. List all templates:
```json
{
  "tool": "wesign_list_templates",
  "args": {
    "offset": 0,
    "limit": 100
  }
}
```

2. Get details for each template:
```json
{
  "tool": "wesign_get_template",
  "args": {
    "templateId": "each-template-id"
  }
}
```

3. Create new template from updated document:
```json
{
  "tool": "wesign_create_template",
  "args": {
    "filePath": "/path/to/updated-template.pdf",
    "name": "Updated Contract Template v2.0",
    "description": "Includes new legal clauses for 2024"
  }
}
```

### 3. Document Audit and Compliance

**User:** "Generate a report of all documents signed this month"

1. Get user info for account context:
```json
{
  "tool": "wesign_get_user_info",
  "args": {}
}
```

2. List recent documents:
```json
{
  "tool": "wesign_list_documents",
  "args": {
    "offset": 0,
    "limit": 100
  }
}
```

3. Get detailed info for each document:
```json
{
  "tool": "wesign_get_document_info",
  "args": {
    "documentCollectionId": "each-document-id"
  }
}
```

## Integration Patterns

### 1. Automated Onboarding Workflow

**Trigger:** New employee joins company

**Workflow:**
1. Extract employee info from HR system
2. Use employment contract template
3. Generate personalized contract
4. Add signature fields
5. Send for signing
6. Download signed contract to HR folder

### 2. Client Contract Management

**Trigger:** New client engagement

**Workflow:**
1. Use appropriate contract template (NDA, Service Agreement, etc.)
2. Customize with client information
3. Add multiple signature fields for approvals
4. Track signing progress
5. Archive completed contracts

### 3. Bulk Document Processing

**Trigger:** Quarterly compliance documents

**Workflow:**
1. Extract recipient list from Excel
2. Generate documents from template
3. Batch create signature requests
4. Monitor completion status
5. Generate compliance report

## Callback/Webhook Integration

### Setting Up Document Status Callbacks

WeSign supports callbacks to notify your system when document status changes. This is useful for integrating WeSign into automated workflows.

**Example: Send document with callback URL**

```json
{
  "tool": "wesign_send_for_signature",
  "args": {
    "filePath": "/path/to/contract.pdf",
    "documentName": "Client Agreement",
    "signers": [
      {
        "contactName": "John Doe",
        "contactMeans": "john.doe@example.com",
        "sendingMethod": 1
      }
    ],
    "redirectUrl": "https://yourdomain.com/signing-complete",
    "callbackUrl": "https://verifypointprodqa.swiftnessint.co.il/api/v1/comda/documentStatus"
  }
}
```

**Callback Payload Structure:**

When a document status changes (signed, declined, canceled, deleted), WeSign will POST to your callback URL with this payload:

```json
{
  "groupId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "contactId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "contactEmail": "signer@example.com",
  "contactPhone": "+1-555-123-4567",
  "notificationType": 0,
  "documentCollectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "documentName": "Client Agreement",
  "documentStatus": 0,
  "occuranceTimeStamp": "2025-09-29T11:59:22.070Z",
  "companyId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "companyName": "Your Company Name",
  "signerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "signerName": "John Doe",
  "signerMessage": "Optional decline reason",
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "userName": "Document Sender Name",
  "templatesIds": [
    "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  ]
}
```

**Document Status Values:**
- `0` - Sent
- `1` - Viewed
- `2` - Signed
- `3` - Declined
- `4` - Canceled
- `5` - Deleted

**Notification Type Values:**
- `0` - Document Sent
- `1` - Document Signed
- `2` - Document Declined
- `3` - Document Canceled
- `4` - Document Deleted

**Implementation Example:**

Your webhook endpoint should:
1. Accept POST requests with JSON body
2. Return 200 OK to acknowledge receipt
3. Process the notification asynchronously

```javascript
// Example webhook handler (Node.js/Express)
app.post('/api/v1/comda/documentStatus', (req, res) => {
  const notification = req.body;

  // Acknowledge receipt immediately
  res.status(200).send('OK');

  // Process asynchronously
  processDocumentNotification(notification);
});

async function processDocumentNotification(notification) {
  if (notification.documentStatus === 2) {
    // Document signed - trigger your workflow
    console.log(`Document ${notification.documentName} signed by ${notification.signerName}`);
    await downloadSignedDocument(notification.documentCollectionId);
  } else if (notification.documentStatus === 3) {
    // Document declined
    console.log(`Document declined: ${notification.signerMessage}`);
  }
}
```

## Best Practices

### 1. Error Recovery
Always check authentication status before operations:
```json
{
  "tool": "wesign_check_auth_status",
  "args": {}
}
```

### 2. File Management
Use absolute paths and verify files exist before operations.

### 3. Batch Operations
For multiple documents, process them sequentially to avoid rate limits.

### 4. Status Monitoring
Regularly check document status for long-running signing processes.

### 5. Cleanup
Logout when done with sensitive operations:
```json
{
  "tool": "wesign_logout",
  "args": {}
}
```

## Testing

### Development Testing

Create test documents and templates:
```json
{
  "tool": "wesign_create_self_sign",
  "args": {
    "filePath": "/test/sample.pdf",
    "name": "Test Document"
  }
}
```

### User Acceptance Testing

Test complete workflows with real documents in a safe environment before production use.

## Tips for AI Assistants

1. **Always verify authentication** before attempting operations
2. **Provide clear feedback** about each step in multi-step workflows
3. **Handle errors gracefully** with helpful suggestions
4. **Validate file paths** before attempting uploads
5. **Offer alternatives** when operations fail
6. **Summarize results** in user-friendly language
7. **Suggest next steps** based on current document state