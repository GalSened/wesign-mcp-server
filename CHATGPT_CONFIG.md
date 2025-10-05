# WeSign MCP Server - ChatGPT Configuration Guide

## Overview

This document provides the complete configuration for integrating the WeSign MCP (Model Context Protocol) server with ChatGPT/OpenAI's custom GPT or API integration.

## Server Information

**Server Name**: WeSign Digital Signature MCP Server
**Version**: 1.0.0
**Protocol**: MCP (Model Context Protocol)
**Base API**: https://devtest.comda.co.il/userapi/v3

## Installation & Setup

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- WeSign API credentials (email & password)

### 2. Server Installation

```bash
# Clone or download the server
cd /path/to/wesign-mcp-server

# Install dependencies
npm install

# Build the TypeScript code
npm run build
```

### 3. Environment Variables

Create a `.env` file or set the following environment variables:

```bash
WESIGN_API_URL=https://devtest.comda.co.il
WESIGN_EMAIL=your-email@example.com
WESIGN_PASSWORD=your-password
```

### 4. MCP Configuration

Add to your MCP configuration file (e.g., `config.json` or `.claude.json`):

```json
{
  "mcpServers": {
    "wesign": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/absolute/path/to/wesign-mcp-server/dist/index.js"
      ],
      "env": {
        "WESIGN_API_URL": "https://devtest.comda.co.il",
        "WESIGN_EMAIL": "your-email@example.com",
        "WESIGN_PASSWORD": "your-password"
      }
    }
  }
}
```

## Available Tools (31 Total)

### Authentication Tools (3)

#### 1. `wesign_login`
Login to WeSign with email and password.

**Parameters**:
- `email` (string, required): WeSign account email
- `password` (string, required): Account password
- `persistent` (boolean, optional): Keep session alive (default: false)

**Example**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "persistent": false
}
```

#### 2. `wesign_logout`
Logout from WeSign and clear authentication tokens.

**Parameters**: None

#### 3. `wesign_refresh_token`
Refresh the authentication token if expired.

**Parameters**: None

---

### Document Management Tools (5)

#### 4. `wesign_upload_document`
Upload a document file to WeSign.

**Supported formats**: PDF, Word (.docx), Excel (.xlsx), Images (PNG, JPG)

**Parameters**:
- `filePath` (string, required): Absolute path to the document file
- `name` (string, optional): Custom name for the document

**Example**:
```json
{
  "filePath": "C:\\Users\\Documents\\contract.pdf",
  "name": "Sales Contract 2025"
}
```

#### 5. `wesign_create_document_collection`
Create a collection with multiple documents.

**Parameters**:
- `name` (string, required): Collection name
- `filePaths` (array of strings, required): Paths to documents

**Example**:
```json
{
  "name": "Contract Bundle",
  "filePaths": [
    "C:\\Users\\Documents\\contract1.pdf",
    "C:\\Users\\Documents\\contract2.pdf"
  ]
}
```

#### 6. `wesign_list_documents`
List user's document collections.

**Parameters**:
- `offset` (number, optional): Starting position (default: 0)
- `limit` (number, optional): Max results (default: 50)

#### 7. `wesign_get_document_info`
Get detailed information about a document collection.

**Parameters**:
- `documentCollectionId` (string, required): Collection ID

#### 8. `wesign_download_document`
Download a signed or unsigned document.

**Parameters**:
- `documentCollectionId` (string, required): Collection ID
- `documentId` (string, required): Specific document ID
- `savePath` (string, optional): Local save path

---

### Self-Signing Tools (6)

#### 9. `wesign_create_self_sign`
Create a document for self-signing (sign it yourself).

**Parameters**:
- `filePath` (string, required): Path to document
- `name` (string, optional): Custom document name
- `sourceTemplateId` (string, optional): Template to use

**Example**:
```json
{
  "filePath": "C:\\Users\\Documents\\contract.pdf",
  "name": "My Contract"
}
```

#### 10. `wesign_add_signature_fields`
Add signature fields to a self-sign document.

**Parameters**:
- `documentCollectionId` (string, required): Collection ID
- `documentId` (string, required): Document ID
- `fields` (array, required): Array of signature field objects

**Field Types**:
- `1` = Signature
- `2` = Initial
- `3` = Text
- `4` = Date
- `5` = Checkbox

**Field Object Structure**:
```json
{
  "x": 100,
  "y": 700,
  "width": 200,
  "height": 50,
  "pageNumber": 1,
  "fieldType": 1
}
```

**Example**:
```json
{
  "documentCollectionId": "abc123",
  "documentId": "doc456",
  "fields": [
    {
      "x": 50,
      "y": 750,
      "width": 200,
      "height": 50,
      "pageNumber": 1,
      "fieldType": 1
    }
  ]
}
```

#### 11. `wesign_complete_signing`
Complete the signing process for a self-sign document.

**Parameters**:
- `documentCollectionId` (string, required): Collection ID
- `documentId` (string, required): Document ID
- `savePath` (string, optional): Path to save signed document

#### 12. `wesign_save_draft`
Save current state as draft without completing.

**Parameters**:
- `documentCollectionId` (string, required)
- `documentId` (string, required)
- `fields` (array, optional): Signature fields to save

#### 13. `wesign_decline_document`
Decline to sign a document.

**Parameters**:
- `documentCollectionId` (string, required)
- `documentId` (string, required)
- `reason` (string, optional): Reason for declining

#### 14. `wesign_get_signing_status`
Get current signing status of a document.

**Parameters**:
- `documentCollectionId` (string, required)

---

### Template Management Tools (4)

#### 15. `wesign_create_template`
Create a reusable document template.

**Parameters**:
- `filePath` (string, required): Path to template file
- `name` (string, required): Template name
- `description` (string, optional): Template description

**Example**:
```json
{
  "filePath": "C:\\Users\\Templates\\nda.pdf",
  "name": "NDA Template 2025",
  "description": "Standard Non-Disclosure Agreement"
}
```

#### 16. `wesign_list_templates`
List all available templates.

**Parameters**:
- `offset` (number, optional): Starting position (default: 0)
- `limit` (number, optional): Max results (default: 50)

#### 17. `wesign_get_template`
Get detailed information about a specific template.

**Parameters**:
- `templateId` (string, required): Template ID

#### 18. `wesign_use_template`
Create a new document from a template for self-signing.

**Parameters**:
- `templateId` (string, required): Template ID to use
- `documentName` (string, required): Name for the new document

---

### Multi-Party Signing Tools (9)

#### 19. `wesign_send_for_signature`
Send document to multiple signers with custom fields.

**Parameters**:
- `filePath` (string, required): Path to document
- `documentName` (string, required): Document name
- `signers` (array, required): Array of signer objects

**Sending Methods**:
- `1` = SMS
- `2` = Email
- `3` = WhatsApp

**Signer Object Structure**:
```json
{
  "contactName": "John Doe",
  "contactMeans": "john@example.com",
  "sendingMethod": 2,
  "linkExpirationInHours": 168,
  "senderNote": "Please sign this document"
}
```

**Full Example**:
```json
{
  "filePath": "C:\\Users\\Documents\\contract.pdf",
  "documentName": "Employment Contract",
  "signers": [
    {
      "contactName": "John Doe",
      "contactMeans": "john@example.com",
      "sendingMethod": 2,
      "linkExpirationInHours": 168,
      "senderNote": "Please review and sign"
    },
    {
      "contactName": "Jane Smith",
      "contactMeans": "0524455586",
      "sendingMethod": 1,
      "linkExpirationInHours": 168
    }
  ]
}
```

#### 20. `wesign_send_document_for_signing`
**Simplified workflow**: Upload PDF, add signature fields automatically, and send.

**Parameters**:
- `filePath` (string, required): Path to PDF file
- `signerName` (string, required): Name of signer
- `signerPhone` (string, required): Phone number for SMS delivery
- `signerEmail` (string, optional): Email for email delivery
- `sendingMethod` (number, optional): 1=SMS, 2=Email, 3=WhatsApp (default: 1)
- `fieldPosition` (object, optional): Custom position for signature fields

**Field Position Object**:
```json
{
  "x": 50,
  "y": 750,
  "width": 200,
  "height": 50
}
```

**Example**:
```json
{
  "filePath": "C:\\Users\\Documents\\contract.pdf",
  "signerName": "Gal",
  "signerPhone": "0524455586",
  "sendingMethod": 1,
  "fieldPosition": {
    "x": 50,
    "y": 750,
    "width": 200,
    "height": 50
  }
}
```

#### 21. `wesign_send_simple_document`
Send document using template to a single signer.

**Parameters**:
- `templateId` (string, required): Template ID
- `documentName` (string, required): Document name
- `signerName` (string, required): Signer's name
- `signerMeans` (string, required): Email or phone number
- `redirectUrl` (string, optional): URL after signing

#### 22. `wesign_resend_to_signer`
Resend document notification to a specific signer.

**Parameters**:
- `documentCollectionId` (string, required)
- `signerId` (string, required)
- `sendingMethod` (number, required): 1=SMS, 2=Email, 3=WhatsApp

#### 23. `wesign_replace_signer`
Replace a signer in an existing document collection.

**Parameters**:
- `documentCollectionId` (string, required)
- `signerId` (string, required): ID of signer to replace
- `newSigner` (object, required): New signer information

**New Signer Object**:
```json
{
  "contactName": "New Signer Name",
  "contactMeans": "newsigner@example.com",
  "sendingMethod": 2
}
```

#### 24. `wesign_cancel_document`
Cancel a document collection and stop the signing process.

**Parameters**:
- `documentCollectionId` (string, required)

#### 25. `wesign_reactivate_document`
Reactivate a cancelled or expired document collection.

**Parameters**:
- `documentCollectionId` (string, required)

#### 26. `wesign_share_document`
Share document with additional people (view-only access).

**Parameters**:
- `documentCollectionId` (string, required)
- `emails` (array of strings, required): Email addresses
- `message` (string, optional): Message to include

**Example**:
```json
{
  "documentCollectionId": "abc123",
  "emails": ["viewer1@example.com", "viewer2@example.com"],
  "message": "FYI - Contract for review"
}
```

#### 27. `wesign_get_signer_link`
Get a live signing link for a specific signer.

**Parameters**:
- `documentCollectionId` (string, required)
- `signerId` (string, required)

---

### Admin & Utility Tools (4)

#### 28. `wesign_get_user_info`
Get current user information and account details.

**Parameters**: None

**Returns**:
```json
{
  "id": "user-id",
  "name": "User Name",
  "email": "user@example.com",
  "companyName": "Company Name",
  "program": {
    "remainingDocumentsForMonth": 100
  }
}
```

#### 29. `wesign_update_user_info`
Update current user information.

**Parameters**:
- `name` (string, required): User's full name
- `email` (string, required): Email address
- `phone` (string, optional): Phone number
- `language` (number, required): 1=English, 2=Hebrew

**Example**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0501234567",
  "language": 1
}
```

#### 30. `wesign_extract_signers_from_excel`
Extract signer information from an Excel file for bulk distribution.

**Parameters**:
- `filePath` (string, required): Path to Excel file

#### 31. `wesign_check_auth_status`
Check current authentication status.

**Parameters**: None

**Returns**:
```json
{
  "authenticated": true,
  "user": {
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

---

## Common Use Cases

### Use Case 1: Send Single Document for Signature via SMS

```json
{
  "tool": "wesign_send_document_for_signing",
  "parameters": {
    "filePath": "C:\\Users\\Documents\\contract.pdf",
    "signerName": "John Doe",
    "signerPhone": "0524455586",
    "sendingMethod": 1,
    "fieldPosition": {
      "x": 50,
      "y": 750,
      "width": 200,
      "height": 50
    }
  }
}
```

### Use Case 2: Send Document to Multiple Signers

```json
{
  "tool": "wesign_send_for_signature",
  "parameters": {
    "filePath": "C:\\Users\\Documents\\contract.pdf",
    "documentName": "Partnership Agreement",
    "signers": [
      {
        "contactName": "Partner 1",
        "contactMeans": "partner1@example.com",
        "sendingMethod": 2
      },
      {
        "contactName": "Partner 2",
        "contactMeans": "0524455586",
        "sendingMethod": 1
      }
    ]
  }
}
```

### Use Case 3: Create Template and Use It

```json
// Step 1: Create template
{
  "tool": "wesign_create_template",
  "parameters": {
    "filePath": "C:\\Users\\Templates\\nda.pdf",
    "name": "Standard NDA"
  }
}

// Step 2: Use template (use returned template ID)
{
  "tool": "wesign_use_template",
  "parameters": {
    "templateId": "template-id-from-step-1",
    "documentName": "NDA - Client XYZ"
  }
}
```

### Use Case 4: Self-Sign Document

```json
// Step 1: Create self-sign document
{
  "tool": "wesign_create_self_sign",
  "parameters": {
    "filePath": "C:\\Users\\Documents\\form.pdf",
    "name": "My Form"
  }
}

// Step 2: Add signature fields (use returned IDs)
{
  "tool": "wesign_add_signature_fields",
  "parameters": {
    "documentCollectionId": "collection-id",
    "documentId": "document-id",
    "fields": [
      {
        "x": 100,
        "y": 700,
        "width": 200,
        "height": 50,
        "pageNumber": 1,
        "fieldType": 1
      }
    ]
  }
}

// Step 3: Complete signing
{
  "tool": "wesign_complete_signing",
  "parameters": {
    "documentCollectionId": "collection-id",
    "documentId": "document-id",
    "savePath": "C:\\Users\\Signed\\form_signed.pdf"
  }
}
```

---

## Phone Number Format

### Israeli Phone Numbers

For Israeli phone numbers, use the format without country code:
- ✅ Correct: `"0524455586"`
- ❌ Incorrect: `"+972524455586"`

The system automatically adds the `+972` country code.

### International Phone Numbers

For non-Israeli numbers, include the full international format:
- ✅ Correct: `"+1234567890"` (US)
- ✅ Correct: `"+447911123456"` (UK)

---

## Error Handling

Common error codes and their meanings:

| Error Code | Meaning | Solution |
|------------|---------|----------|
| 400 | Bad Request | Check required parameters and format |
| 401 | Unauthorized | Login first using `wesign_login` |
| 404 | Not Found | Check document/template ID exists |
| 405 | Method Not Allowed | Endpoint path issue - contact support |
| 500 | Server Error | WeSign API error - retry or contact support |

---

## API Endpoints Reference

All endpoints use base URL: `https://devtest.comda.co.il/userapi/v3`

| Resource | Endpoint | Method |
|----------|----------|--------|
| Login | `/users/login` | POST |
| Get User | `/users` | GET |
| Templates | `/templates` | GET/POST |
| Documents | `/documentcollections` | GET/POST |
| Self-Sign | `/selfsign` | GET/POST/PUT |

---

## Best Practices

1. **Always login first** before using other tools
2. **Check authentication status** periodically with `wesign_check_auth_status`
3. **Use absolute file paths** for all file operations
4. **Handle errors gracefully** and provide clear feedback
5. **Validate phone numbers** before sending (Israeli format: 10 digits starting with 0)
6. **Set appropriate link expiration** (default: 168 hours = 7 days)
7. **Use templates** for frequently sent documents to save time
8. **Check document status** before resending or cancelling

---

## Troubleshooting

### Issue: Login fails with 404
**Solution**: Verify API URL is set to `https://devtest.comda.co.il` (no `/userapi/ui` suffix)

### Issue: Templates return 405 error
**Solution**: Ensure endpoints use lowercase (`/templates` not `/Templates`)

### Issue: Document upload fails
**Solution**: Check file exists and path is absolute (e.g., `C:\\Users\\...`)

### Issue: Phone number not working
**Solution**: For Israeli numbers, use format `0524455586` (no +972)

---

## Support & Contact

For WeSign MCP Server issues:
- **GitHub**: Create an issue in the repository
- **WeSign API**: https://devtest.comda.co.il
- **Documentation**: See README.md in server directory

---

## Version History

- **v1.0.0** (2025-09-30):
  - Initial release
  - 31 tools available
  - Fixed base URL to `/userapi/v3`
  - Fixed endpoint casing (lowercase)
  - Added phone number format handling

---

## Security Notes

⚠️ **Important Security Considerations**:

1. **Never expose credentials** in configuration files committed to version control
2. **Use environment variables** for sensitive data (email, password)
3. **Restrict file system access** - server only reads files you explicitly provide
4. **Validate all inputs** before sending to API
5. **Use HTTPS** - all API calls use secure connections
6. **Token management** - tokens are stored in memory and cleared on logout

---

## License

MIT License - See LICENSE file in the repository

---

## Changelog

See CHANGELOG.md for detailed version history