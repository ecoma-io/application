/**
 * @fileoverview Interface định nghĩa các phương thức mã hóa và giải mã dữ liệu
 * @since 1.0.0
 */

/**
 * Interface định nghĩa các phương thức mã hóa và giải mã dữ liệu
 */
export interface IEncryption {
  /**
   * Mã hóa một chuỗi dữ liệu
   * @param {string} data - Dữ liệu cần mã hóa
   * @returns {Promise<string>} Dữ liệu đã được mã hóa
   * @throws {EncryptionError} Nếu quá trình mã hóa thất bại
   */
  encrypt(data: string): Promise<string>;

  /**
   * Giải mã một chuỗi dữ liệu đã được mã hóa
   * @param {string} encryptedData - Dữ liệu đã được mã hóa
   * @returns {Promise<string>} Dữ liệu đã được giải mã
   * @throws {EncryptionError} Nếu quá trình giải mã thất bại
   */
  decrypt(encryptedData: string): Promise<string>;
}
