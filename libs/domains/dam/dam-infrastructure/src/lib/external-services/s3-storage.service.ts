import { IExternalStorageService } from '@ecoma/dam-domain';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, DeleteObjectsCommand, HeadObjectCommand, CopyObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Triển khai IExternalStorageService sử dụng AWS S3.
 */
export class S3StorageService implements IExternalStorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  /**
   * Khởi tạo S3StorageService.
   *
   * @param options - Các tùy chọn cấu hình
   */
  constructor(options: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    bucketName: string;
  }) {
    this.region = options.region;
    this.bucketName = options.bucketName;

    this.s3Client = new S3Client({
      region: options.region,
      credentials: {
        accessKeyId: options.accessKeyId,
        secretAccessKey: options.secretAccessKey,
      },
    });
  }

  /**
   * Tải lên một file vào S3.
   *
   * @param fileBuffer - Buffer dữ liệu file
   * @param fileName - Tên file để lưu trữ
   * @param filePath - Đường dẫn thư mục trong S3
   * @param contentType - Loại MIME của file
   * @returns Promise với thông tin file đã tải lên
   */
  async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    filePath: string,
    contentType: string
  ): Promise<{
    storedFileName: string;
    filePath: string;
    fileSize: number;
    url?: string;
  }> {
    const fullPath = `${filePath.replace(/^\/|\/$/g, '')}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fullPath,
      Body: fileBuffer,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    return {
      storedFileName: fileName,
      filePath: fullPath,
      fileSize: fileBuffer.length,
    };
  }

  /**
   * Tạo URL có thời hạn để truy cập file.
   *
   * @param filePath - Đường dẫn đầy đủ đến file
   * @param expirationSeconds - Thời gian hết hạn của URL (giây)
   * @returns Promise với URL truy cập
   */
  async generatePresignedUrl(filePath: string, expirationSeconds: number): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn: expirationSeconds });
  }

  /**
   * Xóa một file từ S3.
   *
   * @param filePath - Đường dẫn đầy đủ đến file
   * @returns Promise với true nếu xóa thành công
   */
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      return false;
    }
  }

  /**
   * Xóa nhiều file từ S3.
   *
   * @param filePaths - Danh sách đường dẫn file cần xóa
   * @returns Promise với danh sách đường dẫn file đã xóa thành công
   */
  async deleteFiles(filePaths: string[]): Promise<string[]> {
    if (filePaths.length === 0) {
      return [];
    }

    try {
      const command = new DeleteObjectsCommand({
        Bucket: this.bucketName,
        Delete: {
          Objects: filePaths.map(path => ({ Key: path })),
          Quiet: false,
        },
      });

      const result = await this.s3Client.send(command);

      // Lấy danh sách các key đã xóa thành công
      const deletedKeys = result.Deleted?.map(item => item.Key as string) || [];

      return deletedKeys;
    } catch (error) {
      console.error('Error deleting files from S3:', error);
      return [];
    }
  }

  /**
   * Kiểm tra xem file có tồn tại trong S3 không.
   *
   * @param filePath - Đường dẫn đầy đủ đến file
   * @returns Promise với true nếu file tồn tại
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const command = new HeadObjectCommand({
        Bucket: this.bucketName,
        Key: filePath,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Lấy nội dung của một file từ S3.
   *
   * @param filePath - Đường dẫn đầy đủ đến file
   * @returns Promise với dữ liệu file dạng Buffer
   */
  async getFileContent(filePath: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: filePath,
    });

    const response = await this.s3Client.send(command);

    if (!response.Body) {
      throw new Error(`File not found or empty: ${filePath}`);
    }

    // Chuyển đổi stream thành buffer
    return Buffer.from(await response.Body.transformToByteArray());
  }

  /**
   * Sao chép file trong S3.
   *
   * @param sourceFilePath - Đường dẫn đến file nguồn
   * @param destinationFilePath - Đường dẫn đến file đích
   * @returns Promise với true nếu sao chép thành công
   */
  async copyFile(sourceFilePath: string, destinationFilePath: string): Promise<boolean> {
    try {
      const command = new CopyObjectCommand({
        Bucket: this.bucketName,
        CopySource: `${this.bucketName}/${sourceFilePath}`,
        Key: destinationFilePath,
      });

      await this.s3Client.send(command);
      return true;
    } catch (error) {
      console.error('Error copying file in S3:', error);
      return false;
    }
  }
}
