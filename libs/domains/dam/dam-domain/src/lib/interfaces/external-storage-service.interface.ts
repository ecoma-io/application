/**
 * Interface định nghĩa các phương thức cho dịch vụ lưu trữ file bên ngoài.
 * Đây là interface được sử dụng bởi Domain để tương tác với hệ thống lưu trữ file bên ngoài.
 */
export interface IExternalStorageService {
  /**
   * Tải lên một file vào hệ thống lưu trữ bên ngoài.
   *
   * @param fileBuffer - Buffer dữ liệu file
   * @param fileName - Tên file để lưu trữ
   * @param filePath - Đường dẫn thư mục trong hệ thống lưu trữ
   * @param contentType - Loại MIME của file
   * @returns Promise với thông tin file đã tải lên
   */
  uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    filePath: string,
    contentType: string
  ): Promise<{
    storedFileName: string;
    filePath: string;
    fileSize: number;
    url?: string;
  }>;

  /**
   * Tạo URL có thời hạn để truy cập file.
   *
   * @param filePath - Đường dẫn đầy đủ đến file
   * @param expirationSeconds - Thời gian hết hạn của URL (giây)
   * @returns Promise với URL truy cập
   */
  generatePresignedUrl(filePath: string, expirationSeconds: number): Promise<string>;

  /**
   * Xóa một file từ hệ thống lưu trữ bên ngoài.
   *
   * @param filePath - Đường dẫn đầy đủ đến file
   * @returns Promise với true nếu xóa thành công
   */
  deleteFile(filePath: string): Promise<boolean>;

  /**
   * Xóa nhiều file từ hệ thống lưu trữ bên ngoài.
   *
   * @param filePaths - Danh sách đường dẫn file cần xóa
   * @returns Promise với danh sách đường dẫn file đã xóa thành công
   */
  deleteFiles(filePaths: string[]): Promise<string[]>;

  /**
   * Kiểm tra xem file có tồn tại trong hệ thống lưu trữ bên ngoài không.
   *
   * @param filePath - Đường dẫn đầy đủ đến file
   * @returns Promise với true nếu file tồn tại
   */
  fileExists(filePath: string): Promise<boolean>;

  /**
   * Lấy nội dung của một file từ hệ thống lưu trữ bên ngoài.
   *
   * @param filePath - Đường dẫn đầy đủ đến file
   * @returns Promise với dữ liệu file dạng Buffer
   */
  getFileContent(filePath: string): Promise<Buffer>;

  /**
   * Sao chép file trong hệ thống lưu trữ bên ngoài.
   *
   * @param sourceFilePath - Đường dẫn đến file nguồn
   * @param destinationFilePath - Đường dẫn đến file đích
   * @returns Promise với true nếu sao chép thành công
   */
  copyFile(sourceFilePath: string, destinationFilePath: string): Promise<boolean>;
}
