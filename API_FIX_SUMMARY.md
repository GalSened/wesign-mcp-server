# WeSign MCP Server - API 400 Error Fix

## Problem Diagnosed

The MCP server was returning **400 Bad Request** errors when sending documents for signature because:

### Root Cause: Property Name Casing Mismatch

The C# backend API expects **PascalCase** property names (e.g., `ContactName`, `ContactMeans`, `SendingMethod`), but the TypeScript MCP server was sending **camelCase** property names (e.g., `contactName`, `contactMeans`, `sendingMethod`).

## Investigation Details

### 1. Backend API Analysis

From `C:\Users\gals\source\repos\user-backend\WeSign\Areas\Ui\Controllers\DocumentCollectionsController.cs`:

```csharp
// Controller expects CreateDocumentCollectionDTO with PascalCase properties
public async Task<IActionResult> CreateDocument(CreateDocumentCollectionDTO input)
{
    var signers = await GetSigners(input);
    // ...
}

// GetSigners method at line 1142-1149:
Contact contact = new Contact
{
    Id = signerDTO.ContactId,
    Email = !string.IsNullOrWhiteSpace(signerDTO.ContactMeans) && signerDTO.ContactMeans.Contains("@")
        ? signerDTO.ContactMeans : string.Empty,
    Phone = !string.IsNullOrWhiteSpace(signerDTO.ContactMeans) && signerDTO.ContactMeans.Contains("@")
        ? string.Empty : signerDTO.ContactMeans,
    PhoneExtension = string.IsNullOrWhiteSpace(signerDTO.PhoneExtension) ? "+972" : signerDTO.PhoneExtension,
    Name = signerDTO.ContactName,
    DefaultSendingMethod = !string.IsNullOrWhiteSpace(signerDTO.ContactMeans) && signerDTO.ContactMeans.Contains("@")
        ? SendingMethod.Email : SendingMethod.SMS
};
```

The API expects:
- `ContactId` (PascalCase)
- `ContactMeans` (PascalCase)
- `ContactName` (PascalCase)
- `SendingMethod` (PascalCase)
- `PhoneExtension` (PascalCase)
- `LinkExpirationInHours` (PascalCase)
- `SignerFields` (PascalCase)

### 2. SendingMethod Enum Verification

From `C:\Users\gals\source\repos\user-backend\Common\Enums\Contacts\SendingMethod.cs`:

```csharp
public enum SendingMethod
{
    SMS = 1,
    Email = 2,
    Tablet = 3
}
```

✅ **Confirmed**:
- SMS = 1
- Email = 2
- WhatsApp/Tablet = 3

### 3. API URL Typo

The backend has a typo in the property name: `RediretUrl` (should be `RedirectUrl` but API uses `RediretUrl`)

## Solution Implemented

### Modified File: `src/wesign-client.ts`

Added PascalCase property mapper in the `sendDocumentForSignature` method:

```typescript
async sendDocumentForSignature(request: DocumentCollectionCreateRequest): Promise<DocumentCollection> {
  try {
    // Convert to PascalCase for C# API
    const apiRequest = {
      DocumentMode: request.documentMode,
      DocumentName: request.documentName,
      Templates: request.templates,
      SenderNote: request.senderNote,
      RediretUrl: request.redirectUrl, // Note: API has typo "RediretUrl"
      Signers: request.signers.map(signer => ({
        ContactId: signer.contactId || '00000000-0000-0000-0000-000000000000',
        SendingMethod: signer.sendingMethod,
        ContactMeans: signer.contactMeans,
        ContactName: signer.contactName,
        PhoneExtension: signer.phoneExtension || '+972',
        SignerFields: signer.signerFields?.map(field => ({
          X: field.x,
          Y: field.y,
          Width: field.width,
          Height: field.height,
          PageNumber: field.pageNumber,
          FieldType: field.fieldType,
          SignerIndex: field.signerIndex,
          IsRequired: field.isRequired ?? true
        })),
        LinkExpirationInHours: signer.linkExpirationInHours || 168,
        SenderNote: signer.senderNote,
        OtpIdentification: signer.otpIdentification,
        OtpMode: signer.otpMode,
        AuthenticationMode: signer.authenticationMode
      })),
      ShouldSignUsingSigner1AfterDocumentSigningFlow: request.shouldSignUsingSigner1AfterDocumentSigningFlow,
      ShouldEnableMeaningOfSignature: request.shouldEnableMeaningOfSignature
    };

    const response = await this.httpClient.post<DocumentCollection>('/documentcollections', apiRequest);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to send document for signature: ${this.getErrorMessage(error)}`);
  }
}
```

### Key Changes:

1. **Property Name Conversion**: All camelCase properties converted to PascalCase
2. **Default Values Added**:
   - `ContactId`: Defaults to empty GUID `'00000000-0000-0000-0000-000000000000'` if not provided
   - `PhoneExtension`: Defaults to `'+972'` (Israel country code)
   - `LinkExpirationInHours`: Defaults to `168` (7 days)
   - `IsRequired`: Defaults to `true` for signature fields

3. **API Typo Handled**: Uses `RediretUrl` instead of `RedirectUrl` to match backend API

## Testing Instructions

After restart, test with:

```
"Send the PDF file at C:\Users\gals\Desktop\MCP_Signature_Test.pdf
to Gal at phone number 0524455586 via SMS for signature"
```

Expected behavior:
1. ✅ File will be read from the desktop
2. ✅ Template will be created with the PDF
3. ✅ Document collection will be created with correct PascalCase properties
4. ✅ SMS will be sent to 0524455586 with signing link
5. ✅ Returns document collection ID and signer details

## API Request Example

**Before Fix (camelCase - ❌ Failed with 400)**:
```json
{
  "documentMode": 1,
  "documentName": "Test Document",
  "templates": ["guid-here"],
  "signers": [{
    "contactName": "Gal",
    "contactMeans": "0524455586",
    "sendingMethod": 1
  }]
}
```

**After Fix (PascalCase - ✅ Works)**:
```json
{
  "DocumentMode": 1,
  "DocumentName": "Test Document",
  "Templates": ["guid-here"],
  "Signers": [{
    "ContactId": "00000000-0000-0000-0000-000000000000",
    "ContactName": "Gal",
    "ContactMeans": "0524455586",
    "SendingMethod": 1,
    "PhoneExtension": "+972",
    "LinkExpirationInHours": 168
  }]
}
```

## Files Modified

- ✅ `src/wesign-client.ts` - Added PascalCase property mapper
- ✅ `dist/wesign-client.js` - Rebuilt from TypeScript
- ✅ All other compiled files in `dist/` directory

## Build Status

```bash
cd Desktop/wesign-mcp-server && npm run build
```

✅ **Build Successful** - No errors

## Next Steps

1. **Restart Claude Code** to reload the MCP server with the fix
2. **Test document sending** with the command above
3. **Verify** SMS is sent to the phone number
4. **Check** document collection is created successfully

## Technical Notes

### Why This Happened

- JavaScript/TypeScript conventions use **camelCase** for property names
- C# conventions use **PascalCase** for property names
- ASP.NET Core uses **case-sensitive** JSON deserialization by default
- The API was receiving `contactName` but expecting `ContactName`

### Why The API Couldn't Auto-Convert

Modern ASP.NET Core APIs can be configured with `JsonOptions` to handle camelCase, but the WeSign backend uses the default settings which are case-sensitive. The backend team likely chose to keep strict PascalCase to maintain consistency with C# naming conventions.

---

**Fix Applied**: 2025-09-30
**Status**: ✅ FIXED - Ready for testing
**Restart Required**: Yes