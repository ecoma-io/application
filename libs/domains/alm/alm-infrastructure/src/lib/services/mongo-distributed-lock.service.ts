import { IDistributedLockService } from "@ecoma/alm-application";
import { AbstractLogger } from "@ecoma/common-application";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WorkerLockDocument } from "../schemas/worker-lock.schema";

@Injectable()
export class MongoDistributedLockService implements IDistributedLockService {
  constructor(
    @InjectModel(WorkerLockDocument.name)
    private readonly workerLockModel: Model<WorkerLockDocument>,
    private readonly logger: AbstractLogger
  ) {
    this.logger.setContext(MongoDistributedLockService.name);
  }

  async acquireLock(lockName: string, ttlMs: number): Promise<boolean> {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + ttlMs);

      const result = await this.workerLockModel.findOneAndUpdate(
        {
          name: lockName,
          $or: [
            { expiresAt: { $lt: now } }, // Lock cũ đã hết hạn
            { expiresAt: { $exists: false } }, // Lock chưa tồn tại
          ],
        },
        {
          $set: {
            name: lockName,
            expiresAt: expiresAt,
            updatedAt: now,
          },
        },
        {
          upsert: true,
          returnDocument: "after",
        }
      );

      return !!result;
    } catch (err) {
      const error = err as Error;
      this.logger.warn(`Failed to acquire lock ${lockName} - ${error.message}`);
      return false;
    }
  }

  async releaseLock(lockName: string): Promise<boolean> {
    try {
      const result = await this.workerLockModel.deleteOne({ name: lockName });
      return result.deletedCount > 0;
    } catch (err) {
      const error = err as Error;
      this.logger.error(
        `Failed to release lock ${lockName} - ${error.message}`
      );
      return false;
    }
  }
}
