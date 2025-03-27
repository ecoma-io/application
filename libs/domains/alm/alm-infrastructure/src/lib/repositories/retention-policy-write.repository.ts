import { IRetentionPolicyWriteRepository } from "@ecoma/alm-application";
import { RetentionPolicy, RetentionPolicyId } from "@ecoma/alm-domain";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RetentionPolicyDocument } from "../schemas";

@Injectable()
export class RetentionPolicyWriteRepository
  implements IRetentionPolicyWriteRepository
{
  constructor(
    @InjectModel(RetentionPolicyDocument.name)
    private readonly retentionPolicyModel: Model<RetentionPolicyDocument>
  ) {}

  async save(aggregateRoot: RetentionPolicy): Promise<void> {
    const plain = this.toPersistence(aggregateRoot);
    await this.retentionPolicyModel.updateOne({ id: plain["id"] }, plain, {
      upsert: true,
    });
  }

  async delete(id: RetentionPolicyId): Promise<void> {
    await this.retentionPolicyModel.deleteOne({ id: id.toString() });
  }

  async deleteMany(ids: RetentionPolicyId[]): Promise<void> {
    await this.retentionPolicyModel.deleteMany({
      id: { $in: ids.map((i) => i.toString()) },
    });
  }

  private toPersistence(
    aggregateRoot: RetentionPolicy
  ): Record<string, unknown> {
    const props = aggregateRoot["props"];
    return {
      ...props,
      id: aggregateRoot.id.toString(),
    };
  }
}
