import { AbstractId } from "./base-id";
import { Snowflake } from '@sapphire/snowflake';
import { createHash } from "crypto";
import { GenerateSnowFlakeError, InvalidIdError } from "../../errors";


export class SnowflakeId extends AbstractId {

  private static workerId?: number;
  private static processId?: number;
  private static readonly EPOCH = new Date('2025-01-01T00:00:00.000Z');

  // Có thể thêm validation cụ thể cho định dạng Snowflake ID ở đây nếu cần
  constructor(value: string) {
    super(value);
    // Thêm validation định dạng Snowflake ID (tùy theo cách generate)
    // Ví dụ: kiểm tra là chuỗi số
    if (!/^\d+$/.test(value)) {
      // Giả định BaseError tồn tại từ common-types
      // throw new BaseError(400, `Invalid Snowflake ID format: ${value}`);
      throw new InvalidIdError(`Invalid Snowflake ID format: ${value}`); // Sử dụng Error tạm thời
    }
  }
  /**
   * Tạo một SnowflakeId mới sử dụng thư viện @sapphire/snowflake.
   * @returns Một instance mới của SnowflakeId.
   */
  static generate(): SnowflakeId {
    const generator = new Snowflake(SnowflakeId.EPOCH);
    if(!SnowflakeId.workerId || !SnowflakeId.processId) {
      const { workerId, processId } = SnowflakeId.getProcessAndWorkerIdFromPodUid();
      SnowflakeId.workerId = workerId;
      SnowflakeId.processId = processId;
    }
    generator.workerId = SnowflakeId.workerId;
    generator.processId = SnowflakeId.processId;
    const generatedId = generator.generate();
    // Chuyển BigInt sang string và tạo instance SnowflakeId
    return new SnowflakeId(generatedId.toString());
  }

 /**
 * Helper function để suy ra processId (5-bit) và workerId (5-bit) từ Pod UID.
 * Cần cấu hình Deployment để inject POD_UID vào biến môi trường.
 * @returns Một object chứa processId và workerId.
 */
  private static getProcessAndWorkerIdFromPodUid(): { processId: number; workerId: number } {
    const podUid = process.env["POD_UID"];
    if (!podUid) {
      throw new GenerateSnowFlakeError("POD_UID environment variable is required in this environment.");
    }

    // Sử dụng SHA-256 và lấy một phần của giá trị băm để tạo 10 bit cho instance ID,
    // sau đó chia 10 bit đó thành 5 bit processId và 5 bit workerId.
    try {
      const hash = createHash('sha256').update(podUid).digest();
      // Lấy 2 byte (16 bit) từ cuối băm
      const hashValue16Bit = hash.readUInt16BE(hash.length - 2);

      // Lấy 10 bit từ 16 bit này (ví dụ: 10 bit thấp nhất)
      const instanceId10Bit = hashValue16Bit & 1023; // Mask với 0b1111111111 (10 bit)

      // Chia 10 bit này thành hai phần 5 bit
      const processId = (instanceId10Bit >> 5) & 31; // Lấy 5 bit cao hơn (mask 0b11111 = 31)
      const workerId = instanceId10Bit & 31;        // Lấy 5 bit thấp hơn (mask 0b11111 = 31)

      // Đảm bảo các ID nằm trong phạm vi 5 bit (0-31)
      // Phép toán dịch bit và mask đã đảm bảo điều này.

      return { processId, workerId };
    } catch {
      throw new GenerateSnowFlakeError( "Failed to generate process/worker IDs from POD_UID.");
    }
  }


}
