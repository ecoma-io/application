import { IRetentionPolicyReadRepository } from "@ecoma/alm-application";
import {
  IRetentionPolicyProps,
  RetentionPolicy,
  RetentionPolicyId,
} from "@ecoma/alm-domain";
import { CriteriaQueryDTO } from "@ecoma/common-application";
import { AbstractMongoReadRepository } from "@ecoma/common-infrastructure";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { RetentionPolicyDocument } from "../schemas";

@Injectable()
export class RetentionPolicyReadRepository
  extends AbstractMongoReadRepository<
    RetentionPolicyDocument,
    RetentionPolicyId,
    IRetentionPolicyProps,
    RetentionPolicy
  >
  implements IRetentionPolicyReadRepository
{
  constructor(
    @InjectModel(RetentionPolicyDocument.name)
    retentionPolicyModel: Model<RetentionPolicyDocument>
  ) {
    super(retentionPolicyModel);
  }

  /**
   * Tùy chỉnh query trước khi thực thi để xử lý các trường đặc biệt
   */
  protected override customizeQuery(
    query: Record<string, any>,
    specification: CriteriaQueryDTO
  ): Record<string, any> {
    // Xử lý các trường đặc biệt
    if ("isActive" in specification) {
      return {
        ...query,
        isActive: specification["isActive"],
      };
    }

    return query;
  }

  protected override toDomainModel(
    doc: RetentionPolicyDocument
  ): RetentionPolicy {
    return new RetentionPolicy({
      id: new RetentionPolicyId(doc.id),
      name: doc.name,
      boundedContext: doc.boundedContext,
      description: doc.description,
      actionType: doc.actionType,
      entityType: doc.entityType,
      tenantId: doc.tenantId,
      retentionDays: doc.retentionDays,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findActive(): Promise<RetentionPolicy[]> {
    const documents = await this.model.find({ isActive: true }).lean();
    return documents.map((doc) => this.toDomainModel(doc));
  }
}
