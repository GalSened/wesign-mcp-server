# WeSign MCP Server

A comprehensive Model Context Protocol (MCP) server for integrating with the WeSign digital signature platform. This server enables AI assistants to interact with WeSign's API to manage documents, create signatures, handle templates, and perform administrative tasks.

## Features

### 🔐 Authentication
- Secure login/logout with JWT token management
- Automatic token refresh
- Persistent session support
- Authentication status checking

### 📄 Document Management
- Upload documents for signing workflows
- Create document collections
- List and search documents
- Download signed/unsigned documents
- Track document status and progress

### ✍️ Self-Signing Workflows
- Create self-sign documents
- Add signature fields (signatures, initials, text, dates, checkboxes)
- Complete signing process with automatic PDF generation
- Save drafts and decline documents
- Real-time signing status tracking

### 📋 Template Management
- Create reusable document templates
- List and manage templates
- Generate new documents from templates
- Template status and metadata management

### 👥 User & Admin Functions
- Get and update user profile information
- Extract signer lists from Excel files for bulk operations
- Account and subscription information
- Multi-language support (English/Hebrew)

## Installation

```bash
npm install wesign-mcp-server
```

Or clone and build from source:

```bash
git clone <repository-url>
cd wesign-mcp-server
npm install
npm run build
```

## Configuration

The server can be configured using environment variables:

```bash
export WESIGN_API_URL="https://wesign3.comda.co.il"  # WeSign API base URL
export WESIGN_EMAIL="your-email@example.com"         # Optional: Auto-login email
export WESIGN_PASSWORD="your-password"               # Optional: Auto-login password
export WESIGN_PERSISTENT="false"                     # Optional: Use persistent sessions
```

### Claude Desktop Configuration

Add to your Claude Desktop MCP settings (`claude_desktop_config.json`):

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

## Available Tools

### Authentication Tools

#### `wesign_login`
Authenticate with WeSign using email and password.

**Parameters:**
- `email` (string, required): WeSign account email
- `password` (string, required): WeSign account password
- `persistent` (boolean, optional): Use persistent session (default: false)

**Example:**
```json
{
  "email": "user@example.com",
  "password": "your-password",
  "persistent": false
}
```

#### `wesign_logout`
Logout from WeSign and clear authentication tokens.

#### `wesign_refresh_token`
Refresh the authentication token if expired.

### Document Management Tools

#### `wesign_upload_document`
Upload a document to WeSign for signing workflow.

**Parameters:**
- `filePath` (string, required): Path to the document file
- `name` (string, optional): Custom name for the document

**Supported Formats:** PDF, Word (.doc, .docx), Excel (.xls, .xlsx), Images (.jpg, .png, .gif)

#### `wesign_create_document_collection`
Create a document collection with multiple files.

**Parameters:**
- `name` (string, required): Name for the collection
- `filePaths` (array, required): Array of file paths

#### `wesign_list_documents`
List user's documents with pagination.

**Parameters:**
- `offset` (number, optional): Records to skip (default: 0)
- `limit` (number, optional): Max records (default: 50)

#### `wesign_get_document_info`
Get detailed information about a document collection.

**Parameters:**
- `documentCollectionId` (string, required): Collection ID

#### `wesign_download_document`
Download a signed or unsigned document.

**Parameters:**
- `documentCollectionId` (string, required): Collection ID
- `documentId` (string, required): Document ID
- `savePath` (string, optional): Local save path

### Self-Signing Tools

#### `wesign_create_self_sign`
Create a self-signing document.

**Parameters:**
- `filePath` (string, required): Path to document file
- `name` (string, optional): Custom document name
- `sourceTemplateId` (string, optional): Template ID to use

#### `wesign_add_signature_fields`
Add signature fields to a document.

**Parameters:**
- `documentCollectionId` (string, required): Collection ID
- `documentId` (string, required): Document ID
- `fields` (array, required): Array of field objects:
  - `x`, `y` (number): Position coordinates
  - `width`, `height` (number): Field dimensions
  - `pageNumber` (number): Page number (1-based)
  - `fieldType` (number): Field type (1=Signature, 2=Initial, 3=Text, 4=Date, 5=Checkbox)

#### `wesign_complete_signing`
Complete the signing process and generate final PDF.

**Parameters:**
- `documentCollectionId` (string, required): Collection ID
- `documentId` (string, required): Document ID
- `savePath` (string, optional): Path to save signed document

#### `wesign_save_draft`
Save the current document state as draft.

#### `wesign_decline_document`
Decline to sign a document.

#### `wesign_get_signing_status`
Get current signing status of a document.

### Template Tools

#### `wesign_create_template`
Create a reusable document template.

**Parameters:**
- `filePath` (string, required): Path to template file
- `name` (string, required): Template name
- `description` (string, optional): Template description

#### `wesign_list_templates`
List available templates with pagination.

#### `wesign_get_template`
Get detailed template information.

**Parameters:**
- `templateId` (string, required): Template ID

#### `wesign_use_template`
Create a new document from a template.

**Parameters:**
- `templateId` (string, required): Template ID
- `documentName` (string, required): Name for new document

### Admin & User Tools

#### `wesign_get_user_info`
Get current user information and account details.

#### `wesign_update_user_info`
Update user profile information.

**Parameters:**
- `name` (string, required): Full name
- `email` (string, required): Email address
- `phone` (string, optional): Phone number
- `language` (number, optional): UI language (1=English, 2=Hebrew)

#### `wesign_extract_signers_from_excel`
Extract signer information from Excel file for bulk operations.

**Parameters:**
- `filePath` (string, required): Path to Excel file (.xls or .xlsx)

**Excel Format:**
- Column 1: First Name
- Column 2: Last Name
- Column 3: Phone/Email
- Columns 4+: Additional custom fields

#### `wesign_check_auth_status`
Check current authentication status.

## Usage Examples

### Basic Document Signing Workflow

```typescript
// 1. Login
await wesign_login({
  email: "user@example.com",
  password: "password"
});

// 2. Upload document for self-signing
const result = await wesign_create_self_sign({
  filePath: "/path/to/contract.pdf",
  name: "Employment Contract"
});

// 3. Add signature fields
await wesign_add_signature_fields({
  documentCollectionId: result.documentCollectionId,
  documentId: result.documentId,
  fields: [
    {
      x: 100, y: 200, width: 200, height: 50,
      pageNumber: 1, fieldType: 1  // Signature field
    }
  ]
});

// 4. Complete signing
await wesign_complete_signing({
  documentCollectionId: result.documentCollectionId,
  documentId: result.documentId,
  savePath: "/path/to/signed-contract.pdf"
});
```

### Template Management

```typescript
// Create template
const template = await wesign_create_template({
  filePath: "/path/to/template.pdf",
  name: "NDA Template",
  description: "Standard Non-Disclosure Agreement"
});

// Use template to create new document
await wesign_use_template({
  templateId: template.template.id,
  documentName: "Client NDA - ABC Corp"
});
```

### Bulk Operations

```typescript
// Extract signers from Excel
const signers = await wesign_extract_signers_from_excel({
  filePath: "/path/to/signers.xlsx"
});

// Create document collection for bulk signing
await wesign_create_document_collection({
  name: "Bulk Contract Signing",
  filePaths: ["/path/to/contract1.pdf", "/path/to/contract2.pdf"]
});
```

## Error Handling

The server provides detailed error messages for common issues:

- Authentication failures
- File not found errors
- Invalid document formats
- API rate limiting
- Network connectivity issues

All tool responses follow a consistent format:
```json
{
  "success": true/false,
  "message": "Description of result or error",
  "data": { /* relevant response data */ }
}
```

## API Rate Limits

WeSign enforces rate limits on various endpoints:
- Login attempts: 5 per 5 minutes
- Document creation: 100 per minute
- Template operations: 50 per minute

The server automatically handles rate limiting and provides appropriate error messages.

## Security

- All authentication tokens are managed securely in memory
- Automatic token refresh prevents expired session issues
- No sensitive data is logged or persisted
- File uploads are validated for type and size
- All API communications use HTTPS

## Language Support

WeSign supports multiple languages:
- English (language code: 1)
- Hebrew (language code: 2)

The interface language affects:
- User interface elements
- Email notifications
- Document templates
- Right-to-left (RTL) layout for Hebrew

## Troubleshooting

### Common Issues

**Authentication Failed**
- Verify email and password are correct
- Check if account is active and not blocked
- Ensure API URL is correct

**File Upload Issues**
- Verify file exists and is readable
- Check file format is supported
- Ensure file size is within limits (default: 50MB)

**Network Issues**
- Check internet connectivity
- Verify WeSign API URL is accessible
- Check firewall/proxy settings

### Debug Mode

Enable debug logging with environment variable:
```bash
export DEBUG=wesign:*
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues related to this MCP server, please open an issue on the GitHub repository.

For WeSign API documentation and account issues, contact WeSign support.