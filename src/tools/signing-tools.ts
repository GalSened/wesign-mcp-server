import { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { WeSignClient } from '../wesign-client.js';
import type { SignatureField, FieldType } from '../types.js';
import { DocumentOperation } from '../types.js';
import fs from 'fs-extra';
import * as path from 'path';
import mime from 'mime-types';

export class SigningTools {
  constructor(private client: WeSignClient) {}

  getTools(): Tool[] {
    return [
      {
        name: 'wesign_create_self_sign',
        description: 'Create a self-signing document that you can sign yourself',
        inputSchema: {
          type: 'object',
          properties: {
            filePath: {
              type: 'string',
              description: 'Path to the document file to be signed'
            },
            name: {
              type: 'string',
              description: 'Optional custom name for the document. If not provided, uses filename'
            },
            sourceTemplateId: {
              type: 'string',
              description: 'Optional ID of template to use as source'
            }
          },
          required: ['filePath']
        }
      },
      {
        name: 'wesign_add_signature_fields',
        description: 'Add signature fields to a self-sign document',
        inputSchema: {
          type: 'object',
          properties: {
            documentCollectionId: {
              type: 'string',
              description: 'ID of the document collection'
            },
            documentId: {
              type: 'string',
              description: 'ID of the specific document'
            },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  x: { type: 'number', description: 'X coordinate of the field' },
                  y: { type: 'number', description: 'Y coordinate of the field' },
                  width: { type: 'number', description: 'Width of the field' },
                  height: { type: 'number', description: 'Height of the field' },
                  pageNumber: { type: 'number', description: 'Page number (1-based)' },
                  fieldType: {
                    type: 'number',
                    description: 'Field type: 1=Signature, 2=Initial, 3=Text, 4=Date, 5=Checkbox',
                    enum: [1, 2, 3, 4, 5]
                  }
                },
                required: ['x', 'y', 'width', 'height', 'pageNumber', 'fieldType']
              },
              description: 'Array of signature fields to add'
            }
          },
          required: ['documentCollectionId', 'documentId', 'fields']
        }
      },
      {
        name: 'wesign_complete_signing',
        description: 'Complete the signing process for a self-sign document',
        inputSchema: {
          type: 'object',
          properties: {
            documentCollectionId: {
              type: 'string',
              description: 'ID of the document collection'
            },
            documentId: {
              type: 'string',
              description: 'ID of the specific document'
            },
            savePath: {
              type: 'string',
              description: 'Optional path to save the signed document'
            }
          },
          required: ['documentCollectionId', 'documentId']
        }
      },
      {
        name: 'wesign_save_draft',
        description: 'Save the current state of a self-sign document as draft',
        inputSchema: {
          type: 'object',
          properties: {
            documentCollectionId: {
              type: 'string',
              description: 'ID of the document collection'
            },
            documentId: {
              type: 'string',
              description: 'ID of the specific document'
            },
            fields: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  x: { type: 'number' },
                  y: { type: 'number' },
                  width: { type: 'number' },
                  height: { type: 'number' },
                  pageNumber: { type: 'number' },
                  fieldType: { type: 'number' }
                }
              },
              description: 'Optional array of signature fields to save with draft'
            }
          },
          required: ['documentCollectionId', 'documentId']
        }
      },
      {
        name: 'wesign_decline_document',
        description: 'Decline to sign a document',
        inputSchema: {
          type: 'object',
          properties: {
            documentCollectionId: {
              type: 'string',
              description: 'ID of the document collection'
            },
            documentId: {
              type: 'string',
              description: 'ID of the specific document'
            },
            reason: {
              type: 'string',
              description: 'Optional reason for declining'
            }
          },
          required: ['documentCollectionId', 'documentId']
        }
      },
      {
        name: 'wesign_get_signing_status',
        description: 'Get the current signing status of a document',
        inputSchema: {
          type: 'object',
          properties: {
            documentCollectionId: {
              type: 'string',
              description: 'ID of the document collection'
            }
          },
          required: ['documentCollectionId']
        }
      }
    ];
  }

  async executeSigningTool(name: string, args: any): Promise<any> {
    if (!this.client.isAuthenticated()) {
      throw new Error('Not authenticated. Please login first using wesign_login.');
    }

    switch (name) {
      case 'wesign_create_self_sign':
        return await this.createSelfSign(args.filePath, args.name, args.sourceTemplateId);

      case 'wesign_add_signature_fields':
        return await this.addSignatureFields(args.documentCollectionId, args.documentId, args.fields);

      case 'wesign_complete_signing':
        return await this.completeSigning(args.documentCollectionId, args.documentId, args.savePath);

      case 'wesign_save_draft':
        return await this.saveDraft(args.documentCollectionId, args.documentId, args.fields);

      case 'wesign_decline_document':
        return await this.declineDocument(args.documentCollectionId, args.documentId, args.reason);

      case 'wesign_get_signing_status':
        return await this.getSigningStatus(args.documentCollectionId);

      default:
        throw new Error(`Unknown signing tool: ${name}`);
    }
  }

  private async createSelfSign(filePath: string, customName?: string, sourceTemplateId?: string): Promise<any> {
    try {
      // Check if file exists
      if (!await fs.pathExists(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // Read file and convert to base64
      const fileBuffer = await fs.readFile(filePath);
      const base64Content = fileBuffer.toString('base64');

      // Get file info
      const fileName = customName || path.basename(filePath, path.extname(filePath));
      const mimeType = mime.lookup(filePath) || 'application/octet-stream';

      // Create base64 data URL
      const base64File = `data:${mimeType};base64,${base64Content}`;

      // Create self-sign document
      const result = await this.client.createSelfSignDocument({
        name: fileName,
        base64File: base64File,
        sourceTemplateId: sourceTemplateId
      });

      return {
        success: true,
        message: `Self-sign document "${fileName}" created successfully`,
        documentCollectionId: result.documentCollectionId,
        documentId: result.documentId,
        name: result.name,
        pagesCount: result.pagesCount,
        originalFileName: path.basename(filePath),
        fileSize: fileBuffer.length,
        mimeType: mimeType
      };
    } catch (error: any) {
      throw new Error(`Failed to create self-sign document: ${error.message}`);
    }
  }

  private async addSignatureFields(documentCollectionId: string, documentId: string, fields: SignatureField[]): Promise<any> {
    try {
      // Validate fields
      for (const field of fields) {
        if (!this.isValidFieldType(field.fieldType)) {
          throw new Error(`Invalid field type: ${field.fieldType}. Must be 1-5 (Signature, Initial, Text, Date, Checkbox)`);
        }
        if (field.pageNumber < 1) {
          throw new Error(`Invalid page number: ${field.pageNumber}. Must be 1 or greater`);
        }
      }

      // Save the document with fields
      const result = await this.client.updateSelfSignDocument({
        documentCollectionId: documentCollectionId,
        documentId: documentId,
        fields: fields,
        operation: DocumentOperation.Save
      });

      return {
        success: result.success,
        message: `Added ${fields.length} signature fields to document`,
        fieldsAdded: fields.length,
        fields: fields.map(field => ({
          type: this.getFieldTypeName(field.fieldType),
          position: `(${field.x}, ${field.y})`,
          size: `${field.width}x${field.height}`,
          page: field.pageNumber
        }))
      };
    } catch (error: any) {
      throw new Error(`Failed to add signature fields: ${error.message}`);
    }
  }

  private async completeSigning(documentCollectionId: string, documentId: string, savePath?: string): Promise<any> {
    try {
      // Complete the signing process
      const result = await this.client.updateSelfSignDocument({
        documentCollectionId: documentCollectionId,
        documentId: documentId,
        operation: DocumentOperation.Close
      });

      const response: any = {
        success: result.success,
        message: 'Document signing completed successfully',
        downloadLink: result.downloadLink
      };

      // If save path is provided, download the signed document
      if (savePath && result.downloadLink) {
        try {
          const downloadResult = await this.client.downloadDocument(documentCollectionId, documentId);
          const base64Data = downloadResult.base64File.split(',')[1] || downloadResult.base64File;
          const fileBuffer = Buffer.from(base64Data, 'base64');

          await fs.ensureDir(path.dirname(savePath));
          await fs.writeFile(savePath, fileBuffer);

          response.savedPath = savePath;
          response.fileSize = fileBuffer.length;
          response.message += ` and saved to ${savePath}`;
        } catch (downloadError: any) {
          response.downloadError = `Failed to save signed document: ${downloadError.message}`;
        }
      }

      return response;
    } catch (error: any) {
      throw new Error(`Failed to complete signing: ${error.message}`);
    }
  }

  private async saveDraft(documentCollectionId: string, documentId: string, fields?: SignatureField[]): Promise<any> {
    try {
      const result = await this.client.updateSelfSignDocument({
        documentCollectionId: documentCollectionId,
        documentId: documentId,
        fields: fields,
        operation: DocumentOperation.Save
      });

      return {
        success: result.success,
        message: 'Document draft saved successfully',
        fieldsCount: fields?.length || 0
      };
    } catch (error: any) {
      throw new Error(`Failed to save draft: ${error.message}`);
    }
  }

  private async declineDocument(documentCollectionId: string, documentId: string, reason?: string): Promise<any> {
    try {
      const result = await this.client.updateSelfSignDocument({
        documentCollectionId: documentCollectionId,
        documentId: documentId,
        operation: DocumentOperation.Decline
      });

      return {
        success: result.success,
        message: 'Document declined successfully',
        reason: reason || 'No reason provided'
      };
    } catch (error: any) {
      throw new Error(`Failed to decline document: ${error.message}`);
    }
  }

  private async getSigningStatus(documentCollectionId: string): Promise<any> {
    try {
      const documentCollection = await this.client.getSelfSignDocument(documentCollectionId);

      return {
        success: true,
        documentCollection: {
          id: documentCollection.id,
          name: documentCollection.name,
          status: documentCollection.status,
          statusName: this.getStatusName(documentCollection.status),
          creationTime: documentCollection.creationTime,
          documents: documentCollection.documents?.map(doc => ({
            id: doc.id,
            name: doc.name,
            pagesCount: doc.pagesCount,
            status: doc.status,
            statusName: this.getStatusName(doc.status)
          }))
        }
      };
    } catch (error: any) {
      throw new Error(`Failed to get signing status: ${error.message}`);
    }
  }

  private isValidFieldType(fieldType: number): boolean {
    return fieldType >= 1 && fieldType <= 5;
  }

  private getFieldTypeName(fieldType: FieldType): string {
    const types: { [key: number]: string } = {
      1: 'Signature',
      2: 'Initial',
      3: 'Text',
      4: 'Date',
      5: 'Checkbox'
    };
    return types[fieldType] || 'Unknown';
  }

  private getStatusName(status: number): string {
    const statuses: { [key: number]: string } = {
      0: 'Created',
      1: 'In Progress',
      2: 'Completed',
      3: 'Cancelled',
      4: 'Expired'
    };
    return statuses[status] || 'Unknown';
  }
}