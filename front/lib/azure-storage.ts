import { BlobServiceClient, ContainerClient, BlobGenerateSasUrlOptions, BlobSASPermissions } from '@azure/storage-blob';

// Conditionally import Sharp with error handling
let sharp: any = null;
let sharpAvailable = false;

try {
  sharp = require('sharp');
  sharpAvailable = true;
  console.log('Sharp module loaded successfully');
} catch (error) {
  console.warn('Sharp module not available, falling back to basic functionality:', error);
  sharpAvailable = false;
}

// Test Sharp functionality
export function testSharpAvailability(): { available: boolean; error?: string } {
  if (!sharpAvailable || !sharp) {
    return { available: false, error: 'Sharp module not loaded' };
  }

  try {
    // Create a simple test buffer (1x1 red pixel PNG)
    const testBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x0F, 0x00, 0x00,
      0x01, 0x00, 0x01, 0x5C, 0xC6, 0xBA, 0xD6, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);

    // Test basic Sharp functionality synchronously
    const metadata = sharp(testBuffer).metadata();
    return { available: true };
  } catch (error) {
    return {
      available: false,
      error: `Sharp test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

let blobServiceClient: BlobServiceClient | null = null;

function getBlobServiceClient(): BlobServiceClient {
  if (!blobServiceClient) {
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

    if (!connectionString) {
      throw new Error('Azure Storage connection string not found in environment variables');
    }

    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }

  return blobServiceClient;
}

// Container names
const CONTAINERS = {
  ORIGINALS: 'originals',
  PROCESSED: 'processed',
  THUMBNAILS: 'thumbnails',
} as const;

export interface UploadResult {
  url: string;
  blobName: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ImageMetadata {
  originalUrl: string;
  processedUrl: string;
  thumbnailUrl?: string;
  dimensions: ImageDimensions;
  fileSize: number;
}

class AzureStorageService {
  private async getContainerClient(containerName: string): Promise<ContainerClient> {
    const containerClient = getBlobServiceClient().getContainerClient(containerName);

    // Ensure container exists
    await containerClient.createIfNotExists();

    return containerClient;
  }

  private generateBlobName(userId: string, imageId: string, type: string, extension: string): string {
    return `${userId}/${imageId}_${type}.${extension}`;
  }

  async uploadOriginalImage(
    userId: string,
    imageId: string,
    fileBuffer: Buffer,
    contentType: string,
    originalExtension: string
  ): Promise<UploadResult> {
    const containerClient = await this.getContainerClient(CONTAINERS.ORIGINALS);
    const blobName = this.generateBlobName(userId, imageId, 'original', originalExtension);

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(fileBuffer, fileBuffer.length, {
      blobHTTPHeaders: {
        blobContentType: contentType,
      },
    });

    return {
      url: blockBlobClient.url,
      blobName,
    };
  }

  async uploadProcessedImage(
    userId: string,
    imageId: string,
    processedBuffer: Buffer
  ): Promise<UploadResult> {
    const containerClient = await this.getContainerClient(CONTAINERS.PROCESSED);
    const blobName = this.generateBlobName(userId, imageId, 'processed', 'png');

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(processedBuffer, processedBuffer.length, {
      blobHTTPHeaders: {
        blobContentType: 'image/png',
      },
    });

    return {
      url: blockBlobClient.url,
      blobName,
    };
  }

  async generateThumbnail(
    userId: string,
    imageId: string,
    originalBuffer: Buffer
  ): Promise<UploadResult> {
    let thumbnailBuffer: Buffer;
    let contentType: string;
    let extension: string;

    if (sharpAvailable && sharp) {
      try {
        // Generate thumbnail (300x300 max, WebP format) using Sharp
        thumbnailBuffer = await sharp(originalBuffer)
          .resize(300, 300, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .webp({ quality: 80 })
          .toBuffer();
        contentType = 'image/webp';
        extension = 'webp';
      } catch (error) {
        console.warn('Sharp thumbnail generation failed, using original image:', error);
        // Fallback to original image as thumbnail
        thumbnailBuffer = originalBuffer;
        contentType = 'image/jpeg'; // Default assumption
        extension = 'jpg';
      }
    } else {
      // Fallback: use original image as thumbnail when Sharp is not available
      console.log('Sharp not available, using original image as thumbnail');
      thumbnailBuffer = originalBuffer;
      contentType = 'image/jpeg'; // Default assumption
      extension = 'jpg';
    }

    const containerClient = await this.getContainerClient(CONTAINERS.THUMBNAILS);
    const blobName = this.generateBlobName(userId, imageId, 'thumb', extension);

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(thumbnailBuffer, thumbnailBuffer.length, {
      blobHTTPHeaders: {
        blobContentType: contentType,
      },
    });

    return {
      url: blockBlobClient.url,
      blobName,
    };
  }

  async getImageDimensions(buffer: Buffer): Promise<ImageDimensions> {
    if (sharpAvailable && sharp) {
      try {
        const metadata = await sharp(buffer).metadata();
        return {
          width: metadata.width || 0,
          height: metadata.height || 0,
        };
      } catch (error) {
        console.warn('Sharp metadata extraction failed, returning default dimensions:', error);
      }
    }

    // Fallback: return default dimensions when Sharp is not available
    console.log('Sharp not available, returning default dimensions');
    return {
      width: 800, // Default width assumption
      height: 600, // Default height assumption
    };
  }

  async deleteImage(userId: string, imageId: string, originalExtension: string): Promise<void> {
    // Try to delete both possible thumbnail formats (webp and jpg)
    const deletePromises = [
      // Delete original
      this.getContainerClient(CONTAINERS.ORIGINALS).then(client =>
        client.deleteBlob(this.generateBlobName(userId, imageId, 'original', originalExtension))
      ),
      // Delete processed
      this.getContainerClient(CONTAINERS.PROCESSED).then(client =>
        client.deleteBlob(this.generateBlobName(userId, imageId, 'processed', 'png'))
      ),
      // Delete thumbnail (webp format - when Sharp is available)
      this.getContainerClient(CONTAINERS.THUMBNAILS).then(client =>
        client.deleteBlob(this.generateBlobName(userId, imageId, 'thumb', 'webp'))
      ).catch(() => {}), // Ignore if not found
      // Delete thumbnail (jpg format - when Sharp is not available)
      this.getContainerClient(CONTAINERS.THUMBNAILS).then(client =>
        client.deleteBlob(this.generateBlobName(userId, imageId, 'thumb', 'jpg'))
      ).catch(() => {}), // Ignore if not found
    ];

    await Promise.allSettled(deletePromises);
  }

  async generateSasUrl(blobUrl: string, expiresInHours: number = 1): Promise<string> {
    try {
      const url = new URL(blobUrl);
      const containerName = url.pathname.split('/')[1];
      const blobName = url.pathname.substring(url.pathname.indexOf('/', 1) + 1);

      const containerClient = await this.getContainerClient(containerName);
      const blobClient = containerClient.getBlobClient(blobName);

      const sasOptions: BlobGenerateSasUrlOptions = {
        permissions: BlobSASPermissions.parse('r'),
        expiresOn: new Date(Date.now() + expiresInHours * 60 * 60 * 1000),
      };

      return await blobClient.generateSasUrl(sasOptions);
    } catch (error) {
      console.error('Error generating SAS URL:', error);
      return blobUrl; // Fallback to original URL
    }
  }
}

export const azureStorage = new AzureStorageService();