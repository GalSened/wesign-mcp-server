# New WeSign MCP Tools

## Overview
Two new tools have been added to the WeSign MCP Server for advanced document management:

1. **wesign_search_documents** - Search and filter documents
2. **wesign_merge_documents** - Combine multiple documents into one collection

---

## 1. wesign_search_documents

Search through your documents using multiple filter criteria.

### Features
- Full-text search in document names, signer names, and emails
- Filter by document status (Draft/Pending/Completed/Cancelled)
- Filter by date range (creation date)
- Filter by signer email or name
- Flexible combination of filters

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | No | Search query - searches in document names, signer names, and emails |
| `status` | number | No | Filter by document status: 0=Draft, 1=Pending, 2=Completed, 3=Cancelled |
| `fromDate` | string | No | Filter documents created after this date (ISO 8601: YYYY-MM-DD) |
| `toDate` | string | No | Filter documents created before this date (ISO 8601: YYYY-MM-DD) |
| `signerEmail` | string | No | Filter by signer email address |
| `signerName` | string | No | Filter by signer name (partial match) |
| `limit` | number | No | Maximum number of results to return (default: 100) |

### Example Usage

#### Search by keyword
```json
{
  "tool": "wesign_search_documents",
  "parameters": {
    "query": "contract"
  }
}
```

#### Filter by status
```json
{
  "tool": "wesign_search_documents",
  "parameters": {
    "status": 2,
    "limit": 50
  }
}
```

#### Search with date range
```json
{
  "tool": "wesign_search_documents",
  "parameters": {
    "fromDate": "2025-01-01",
    "toDate": "2025-03-31",
    "status": 2
  }
}
```

#### Filter by signer
```json
{
  "tool": "wesign_search_documents",
  "parameters": {
    "signerEmail": "john@example.com"
  }
}
```

#### Combined filters
```json
{
  "tool": "wesign_search_documents",
  "parameters": {
    "query": "NDA",
    "status": 1,
    "signerName": "John",
    "fromDate": "2025-01-01"
  }
}
```

### Response Format
```json
{
  "success": true,
  "message": "Found 5 document(s) matching criteria",
  "count": 5,
  "filters": {
    "query": "contract",
    "status": 2,
    "fromDate": "2025-01-01",
    "toDate": "none",
    "signerEmail": "none",
    "signerName": "none"
  },
  "documents": [
    {
      "id": "doc-123",
      "name": "Employment Contract",
      "status": 2,
      "statusText": "Completed",
      "creationTime": "2025-02-15T10:30:00Z",
      "documentsCount": 1,
      "signersCount": 2,
      "completedSigners": 2,
      "signers": [
        {
          "name": "John Doe",
          "email": "john@example.com",
          "phone": "+1234567890",
          "status": 2
        }
      ]
    }
  ]
}
```

---

## 2. wesign_merge_documents

Combine multiple document collections into a single new collection. Useful for:
- Creating document packages
- Combining related documents
- Archiving multiple documents together

### Features
- Merge 2 or more document collections
- Preserves all original documents
- Creates a new collection with all merged documents
- Provides detailed information about source documents

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Name for the merged document collection |
| `documentCollectionIds` | string[] | Yes | Array of document collection IDs to merge (minimum 2) |

### Example Usage

#### Basic merge
```json
{
  "tool": "wesign_merge_documents",
  "parameters": {
    "name": "Complete Contract Package",
    "documentCollectionIds": [
      "collection-abc-123",
      "collection-def-456"
    ]
  }
}
```

#### Merge multiple documents
```json
{
  "tool": "wesign_merge_documents",
  "parameters": {
    "name": "Q1 2025 Employee Documents",
    "documentCollectionIds": [
      "collection-employment",
      "collection-nda",
      "collection-handbook",
      "collection-benefits"
    ]
  }
}
```

### Response Format
```json
{
  "success": true,
  "message": "Merged 3 document collections into \"Complete Contract Package\"",
  "mergedCollectionId": "new-collection-xyz-789",
  "mergedCollectionName": "Complete Contract Package",
  "totalDocuments": 5,
  "sourceCollections": 3,
  "documentsDetails": [
    {
      "sourceCollection": "Employment Contract",
      "sourceCollectionId": "collection-abc-123",
      "documentName": "contract.pdf",
      "documentId": "doc-1",
      "pagesCount": 10
    },
    {
      "sourceCollection": "NDA Agreement",
      "sourceCollectionId": "collection-def-456",
      "documentName": "nda.pdf",
      "documentId": "doc-2",
      "pagesCount": 5
    }
  ]
}
```

---

## Usage Examples

### Using with HTTP Server

If you're running the HTTP server (port 8080), you can test these tools with curl:

```bash
# Search for completed documents
curl -X POST http://localhost:8080/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "wesign_search_documents",
    "parameters": {
      "status": 2,
      "limit": 10
    }
  }'

# Merge documents
curl -X POST http://localhost:8080/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "wesign_merge_documents",
    "parameters": {
      "name": "Merged Contracts",
      "documentCollectionIds": ["id1", "id2"]
    }
  }'
```

### Using with MCP Client

If using the tools through an MCP client:

```typescript
// Search documents
const searchResult = await client.callTool('wesign_search_documents', {
  query: 'NDA',
  status: 1
});

// Merge documents
const mergeResult = await client.callTool('wesign_merge_documents', {
  name: 'Merged Package',
  documentCollectionIds: ['coll1', 'coll2']
});
```

---

## Status Codes Reference

Document status values:
- **0** - Draft
- **1** - Pending
- **2** - Completed
- **3** - Cancelled

Signer status values:
- **0** - Not Started
- **1** - In Progress
- **2** - Completed
- **3** - Declined

---

## Notes

### Search Tool
- The search tool fetches documents from the WeSign API and performs filtering client-side
- All filters are optional and can be combined
- Text search is case-insensitive
- Date comparisons use ISO 8601 format (YYYY-MM-DD)
- The `limit` parameter controls the maximum number of documents fetched from the API before filtering

### Merge Tool
- Minimum 2 document collections required for merging
- All documents from each collection are downloaded and re-uploaded to create the merged collection
- Original collections remain unchanged
- The merged collection will have all documents from all source collections
- Document order is preserved based on the order of collection IDs provided

---

## Error Handling

Both tools return descriptive error messages if something goes wrong:

```json
{
  "error": "Failed to search documents: <detailed error message>"
}
```

Common errors:
- **Search**: "Not authenticated. Please login first using wesign_login."
- **Merge**: "At least 2 document collections are required for merging"
- **Merge**: "Document collection {id} has no documents"

---

## Testing

Test files are provided:
- `test-search-documents.json` - Example search query
- `test-merge-documents.json` - Example merge operation

To test with the HTTP server:
```bash
cd /c/Users/gals/Desktop/wesign-mcp-server
npm run build
# Start server in another terminal
# Then test:
curl -X POST http://localhost:8080/tools/call -H "Content-Type: application/json" -d @test-search-documents.json
```
