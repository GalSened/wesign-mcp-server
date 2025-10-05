# WeSign Platform - Complete Knowledge Base

## 🏗️ System Architecture Overview

### Technology Stack
- **Backend**: .NET 9.0 with ASP.NET Core Web API
- **Frontend**: Angular 15.2.10
- **Database**: SQL Server with Entity Framework Core 9.0.2
- **Authentication**: JWT Bearer Tokens with Refresh Token support
- **Real-time**: SignalR for live updates
- **Background Jobs**: Hangfire
- **Logging**: Serilog structured logging
- **API Documentation**: Swagger/OpenAPI

### N-Tier Architecture
```
┌─────────────────────────────────────────────┐
│         Presentation Layer (WeSign)         │
│    Angular 15 Frontend + ASP.NET MVC       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│     Business Logic Layer (BL, SignerBL)     │
│         Handlers & Service Interfaces       │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│     Data Access Layer (DAL)                 │
│     Entity Framework & Repositories         │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│        Database (SQL Server)                │
└─────────────────────────────────────────────┘
```

## 📡 API Endpoints Structure

### Base URLs
- **Production**: `https://wesign3.comda.co.il/userapi/ui/v3`
- **Dev/Test**: `https://devtest.comda.co.il/userapi/ui/v3`
- **API Route Pattern**: `/v3/[controller]/[action]`

### Core Controllers

#### 1. UsersController (`/v3/users`)
**Authentication & User Management**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Login with email/password | ❌ |
| GET | `/Logout` | Logout and clear session | ✅ |
| POST | `/refresh` | Refresh JWT token | ✅ |
| POST | `/` | User sign up | ❌ |
| GET | `/` | Get current user info | ✅ |
| PUT | `/` | Update user profile | ✅ |
| POST | `/password/change` | Change password | ✅ |
| POST | `/password/reset` | Reset password | ❌ |
| POST | `/phone/update` | Update phone number | ✅ |
| POST | `/phone/validate` | Validate phone OTP | ✅ |
| POST | `/activation` | Activate account | ❌ |
| POST | `/otp/login` | OTP-based login | ❌ |

**Login Request:**
```json
{
  "Email": "user@example.com",
  "Password": "your-password"
}
```

**Login Response:**
```json
{
  "success": true,
  "token": "jwt-access-token",
  "refreshToken": "refresh-token",
  "authToken": "auth-token"
}
```

#### 2. DocumentCollectionsController (`/v3/documentcollections`)
**Document Lifecycle Management**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all document collections with filters |
| GET | `/{id}` | Get specific document collection |
| GET | `/info/{id}` | Get detailed document info |
| POST | `/` | Create new document collection |
| POST | `/Simple` | Create simple document (template-based) |
| PUT | `/{id}` | Update document collection |
| DELETE | `/{id}` | Delete document collection |
| GET | `/{id}` (Accept: arraybuffer) | Download document ZIP |
| GET | `/{collectionId}/documents/{docId}/pages` | Get page count |
| GET | `/{collectionId}/documents/{docId}/pages/{page}` | Get specific page |
| GET | `/{collectionId}/signers/{signerId}/method/{method}` | Resend to signer |
| PUT | `/{collectionId}/signer/{signerId}/replace` | Replace signer |
| PUT | `/{collectionId}/cancel` | Cancel document |
| GET | `/{collectionId}/reactivate` | Reactivate document |
| POST | `/share` | Share document for viewing |
| GET | `/{collectionId}/senderLink/{signerId}` | Get live signing link |
| PUT | `/deletebatch` | Batch delete documents |
| POST | `/downloadbatch` | Batch download documents |

**Document Statuses:**
- `Created = 1`
- `Sent = 2`
- `Viewed = 3`
- `Signed = 4`
- `Declined = 5`
- `SendingFailed = 6`
- `Deleted = 7`
- `Canceled = 8`

**Document Modes:**
- `OrderedGroupSign = 1` - Sequential signing
- `GroupSign = 2` - Parallel signing
- `Online = 3` - Online signing mode
- `SelfSign = 100` - Self-signing mode

#### 3. SelfSignController (`/v3/selfsign`)
**Self-Signing Workflows**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create self-sign document |
| PUT | `/` | Update self-sign document (add fields, sign, save draft) |
| DELETE | `/{id}` | Delete self-sign document |
| GET | `/download/smartcard` | Download SmartCard installer |
| POST | `/sign` | Sign using Signer1 (qualified signature) |
| POST | `/sign/verify` | Verify Signer1 credentials |

**Document Operations:**
- `Save = 1` - Save as draft
- `Decline = 2` - Decline to sign
- `Close = 3` - Complete signing

**Field Types:**
- `Signature = 1` - Graphic signature field
- `Initial = 2` - Initial field
- `Text = 3` - Text input field
- `Date = 4` - Date field
- `Checkbox = 5` - Checkbox field

#### 4. TemplatesController (`/v3/templates`)
**Template Management**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create new template |
| GET | `/` | List templates with filters |
| GET | `/{id}` | Get template details |
| PUT | `/{id}` | Update template fields |
| DELETE | `/{id}` | Delete template |
| GET | `/{id}/pages` | Get template page count |
| GET | `/{id}/pages/{page}` | Get specific page details |
| GET | `/{id}/pages/range` | Get page range with fields |
| POST | `/{id}` | Duplicate template |
| GET | `/{id}/download` | Download template as PDF |
| PUT | `/deletebatch` | Batch delete templates |
| POST | `/merge` | Merge multiple templates |

**Template Statuses:**
- `OneTimeUse = 0` - Single-use template
- `MultipleUse = 1` - Reusable template

#### 5. ContactsController (`/v3/contacts`)
**Contact Management**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create contact |
| POST | `/bulk` | Bulk create contacts |
| GET | `/` | Search contacts |
| GET | `/{id}` | Get contact by ID |
| PUT | `/{id}` | Update contact |
| DELETE | `/{id}` | Delete contact |
| PUT | `/deletebatch` | Batch delete contacts |
| GET | `/Groups` | List contact groups |
| GET | `/Group/{id}` | Get contact group |
| POST | `/Group` | Create contact group |
| PUT | `/Group/{id}` | Update contact group |
| DELETE | `/Group/{id}` | Delete contact group |

#### 6. DistributionController (`/v3/distribution`)
**Bulk Operations**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/signers` | Extract signers from Excel file |

**Excel Format for Signers:**
- Column 1: First Name
- Column 2: Last Name
- Column 3: Phone/Email
- Columns 4+: Additional custom fields

#### 7. ReportsController (`/v3/reports`)
**Analytics & Reporting**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get usage reports |
| GET | `/dashboard` | Get dashboard statistics |

#### 8. ConfigurationController (`/v3/configuration`)
**System Configuration**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get system configuration |

**Configuration Settings:**
- `enableFreeTrailUsers` - Enable free trial users
- `enableTabletsSupport` - Enable tablet signing
- `shouldUseReCaptchaInRegistration` - ReCAPTCHA requirement

## 🔐 Authentication & Security

### JWT Token Flow
```
1. Login → Receive: accessToken, refreshToken, authToken
2. Use accessToken in Authorization header: "Bearer {accessToken}"
3. Token expires → Auto-refresh using refreshToken
4. Refresh fails → Re-login required
```

### Sending Methods
```typescript
enum SendingMethod {
  SMS = 1,
  Email = 2,
  WhatsApp = 3,
  Tablet = 4
}
```

### Authentication Modes
```typescript
enum AuthenticationMode {
  None = 0,
  IDP = 1,      // ID verification
  VisualIDP = 2 // Visual ID verification
}
```

## 📋 Common Workflows

### Workflow 1: Self-Sign Document
```
1. POST /selfsign - Create document
   Input: { Name, Base64File, SourceTemplateId? }
   Output: { DocumentCollectionId, DocumentId, PagesCount }

2. PUT /selfsign - Add signature fields
   Input: { DocumentCollectionId, DocumentId, Fields[], Operation: Save }
   Output: { Success }

3. PUT /selfsign - Complete signing
   Input: { DocumentCollectionId, DocumentId, Operation: Close }
   Output: { Base64SignedFile, FileName }
```

### Workflow 2: Send for Multi-Party Signing
```
1. POST /templates - Create template
   Input: { Name, Base64File }
   Output: { TemplateId, PagesCount }

2. POST /documentcollections/Simple - Send document
   Input: {
     TemplateId,
     Name,
     Signers: [{ Name, Email/Phone, SendingMethod }],
     Mode: OrderedGroupSign | GroupSign
   }
   Output: { DocumentCollectionId, Status }

3. GET /documentcollections/{id} - Track status
   Output: { Status, Signers: [{ Status, SignedDate }] }
```

### Workflow 3: Bulk Signing
```
1. POST /distribution/signers - Extract from Excel
   Input: { Base64File: <excel-file> }
   Output: { Signers: [{ FirstName, LastName, Contact }] }

2. POST /templates - Create template

3. Loop through signers:
   POST /documentcollections/Simple - Send to each signer
```

## 🎨 Frontend Integration

### Angular Services Structure
```typescript
// User API Service
userApi.login(email, password)
userApi.getCurrentUser()
userApi.updateUser(user)

// Document API Service
documentApi.getDocuments(filter)
documentApi.documentCreate(request)
documentApi.downloadDocument(collectionId)
documentApi.cancelDocument(collectionId)

// Template API Service
templateApi.getTemplates(filter)
templateApi.createTemplate(request)
templateApi.downloadTemplate(id)

// Contact API Service
contactApi.getContacts(filter)
contactApi.createContact(contact)
contactApi.createContactGroup(group)
```

### SignalR Real-Time Events
```typescript
// Document status updates
hubConnection.on('DocumentStatusChanged', (data) => {
  // Handle real-time status updates
});

// Signer status updates
hubConnection.on('SignerStatusChanged', (data) => {
  // Handle signer progress updates
});
```

## 📊 Data Models

### User Model
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName: string;
  userType: UserType; // Basic=1, Editor=2, CompanyAdmin=3
  language: Language; // English=1, Hebrew=2
  program: {
    remainingDocumentsForMonth: number;
    totalDocumentsForMonth: number;
  };
}
```

### Document Collection Model
```typescript
interface DocumentCollection {
  id: string;
  name: string;
  status: DocumentStatus;
  mode: DocumentMode;
  createdDate: Date;
  documents: Document[];
  signers: Signer[];
}
```

### Signer Model
```typescript
interface Signer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  sendingMethod: SendingMethod;
  status: SignerStatus; // Sent=1, Viewed=2, Signed=3, Rejected=4
  order: number;
  signedDate?: Date;
}
```

### Template Model
```typescript
interface Template {
  id: string;
  name: string;
  status: TemplateStatus;
  images: TemplateImage[];
  fields: PDFField[];
  createdDate: Date;
  usageCount: number;
}
```

## 🐛 Error Handling

### Common Error Codes
```typescript
enum ResultCode {
  Success = 0,
  InvalidToken = 1,
  InvalidEmail = 2,
  InvalidPassword = 3,
  UserNotFound = 4,
  DocumentNotFound = 5,
  TemplateNotFound = 6,
  UnauthorizedAccess = 7,
  RateLimitExceeded = 8,
  InvalidFileFormat = 9,
  FileSizeExceeded = 10
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errorCode": 5,
  "details": {
    "field": "specific error detail"
  }
}
```

## 🔧 Configuration & Environment

### Environment Variables
```bash
WESIGN_API_URL=https://devtest.comda.co.il/userapi/ui
WESIGN_EMAIL=your-email@example.com
WESIGN_PASSWORD=your-password
```

### API Rate Limits
- Login attempts: 5 per 5 minutes
- Document creation: 100 per minute
- Template operations: 50 per minute
- General API calls: 1000 per hour

## 🎯 Best Practices

### 1. File Handling
- Always use Base64 encoding for file transfers
- Maximum file size: 50MB per file
- Supported formats: PDF, DOCX, DOC, XLSX, XLS, JPG, PNG, GIF
- Use multipart/form-data for large files

### 2. Template Usage
- Create templates for recurring documents
- Use OneTimeUse for unique documents
- Use MultipleUse for standard forms
- Template fields are reusable across instances

### 3. Multi-Party Signing
- Always create template first
- Use OrderedGroupSign for sequential approval
- Use GroupSign for parallel signing
- Set appropriate SendingMethod per signer

### 4. Error Recovery
- Implement automatic token refresh
- Retry failed requests with exponential backoff
- Handle 429 (Rate Limit) gracefully
- Log all API errors for debugging

### 5. Performance Optimization
- Use pagination for large lists (offset/limit)
- Cache template data locally
- Batch operations when possible
- Use SignalR for real-time updates instead of polling

## 📱 Multi-Language Support

### Language Codes
- English: `1`
- Hebrew: `2`

### RTL Support
- Hebrew interface uses RTL layout
- All text fields support bidirectional text
- UI elements mirror for RTL languages

## 🔒 Compliance & Security

### Features
- Qualified electronic signatures (Signer1)
- Visual ID verification
- Audit trails for all actions
- Document encryption at rest
- TLS 1.2+ for all communications
- GDPR compliant data handling

### Signature Types
1. **Graphic Signature** - User-drawn signature
2. **SmartCard Signature** - Hardware token signature
3. **Server Signature** - Server-side qualified signature
4. **Biometric Signature** - Tablet with stylus

## 📈 Analytics & Monitoring

### Available Metrics
- Documents sent/signed per period
- Active users (DAU/WAU/MAU)
- Average time-to-sign
- Abandonment rates
- Template usage statistics
- Signer engagement metrics

### Dashboard Endpoints
```
GET /v3/reports/dashboard
GET /v3/reports?from={date}&to={date}
```

## 🚀 Advanced Features

### 1. Smart Field Detection
- Automatic field detection from PDF forms
- OCR-based field extraction
- Field type inference

### 2. Template Merging
- Combine multiple templates
- Maintain field consistency
- Generate composite documents

### 3. Bulk Operations
- Extract signers from Excel
- Send to multiple recipients
- Batch document processing

### 4. Integration APIs
- Webhook support for events
- REST API for all operations
- SignalR for real-time updates

## 📝 Testing Endpoints

### Test Environment
Base URL: `https://devtest.comda.co.il/userapi/ui/v3`

### Test Credentials
```
Email: nirk@comsign.co.il
Password: Comsign1!
```

### Quick Test Sequence
```bash
# 1. Login
curl -X POST "https://devtest.comda.co.il/userapi/ui/v3/users/login" \
  -H "Content-Type: application/json" \
  -d '{"Email":"nirk@comsign.co.il","Password":"Comsign1!"}'

# 2. Get User Info
curl -X GET "https://devtest.comda.co.il/userapi/ui/v3/users" \
  -H "Authorization: Bearer {token}"

# 3. List Documents
curl -X GET "https://devtest.comda.co.il/userapi/ui/v3/documentcollections?offset=0&limit=10" \
  -H "Authorization: Bearer {token}"
```

## 🎓 Training Resources

### Official Documentation
- Swagger UI: `https://wesign3.comda.co.il/userapi/swagger/index.html`
- Developer Portal: Contact WeSign support

### Common Issues & Solutions
1. **401 Unauthorized** → Token expired, refresh or re-login
2. **429 Too Many Requests** → Rate limit hit, wait and retry
3. **400 Bad Request** → Invalid request format, check payload
4. **404 Not Found** → Resource doesn't exist or deleted
5. **500 Internal Server Error** → Server issue, retry or contact support

---

**Last Updated**: 2025-09-30
**API Version**: v3
**MCP Server Version**: 1.0.0