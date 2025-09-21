import { BlobServiceClient, ContainerClient, BlobGenerateSasUrlOptions, BlobSASPermissions } from '@azure/storage-blob';
import sharp from 'sharp';

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
    // Generate thumbnail (300x300 max, WebP format)
    const thumbnailBuffer = await sharp(originalBuffer)
      .resize(300, 300, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toBuffer();

    const containerClient = await this.getContainerClient(CONTAINERS.THUMBNAILS);
    const blobName = this.generateBlobName(userId, imageId, 'thumb', 'webp');

    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.upload(thumbnailBuffer, thumbnailBuffer.length, {
      blobHTTPHeaders: {
        blobContentType: 'image/webp',
      },
    });

    return {
      url: blockBlobClient.url,
      blobName,
    };
  }

  async getImageDimensions(buffer: Buffer): Promise<ImageDimensions> {
    const metadata = await sharp(buffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  }

  async deleteImage(userId: string, imageId: string, originalExtension: string): Promise<void> {
    const deletePromises = [
      // Delete original
      this.getContainerClient(CONTAINERS.ORIGINALS).then(client =>
        client.deleteBlob(this.generateBlobName(userId, imageId, 'original', originalExtension))
      ),
      // Delete processed
      this.getContainerClient(CONTAINERS.PROCESSED).then(client =>
        client.deleteBlob(this.generateBlobName(userId, imageId, 'processed', 'png'))
      ),
      // Delete thumbnail
      this.getContainerClient(CONTAINERS.THUMBNAILS).then(client =>
        client.deleteBlob(this.generateBlobName(userId, imageId, 'thumb', 'webp'))
      ),
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