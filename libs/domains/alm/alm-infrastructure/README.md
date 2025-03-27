# ALM Infrastructure Layer

## Giới thiệu

Module `alm-infrastructure` là phần triển khai cơ sở hạ tầng của hệ thống Audit Log Management (ALM). Module này cung cấp các implementation cho các interface repository được định nghĩa trong `alm-application`, các schema MongoDB, và các utility hỗ trợ khác cho việc tương tác với cơ sở dữ liệu và hệ thống bên ngoài.

## Thành phần chính

### Repositories

- `AuditLogWriteRepository`: Triển khai interface `IAuditLogWriteRepository` để lưu trữ audit logs vào MongoDB
- `AuditLogReadRepository`: Triển khai interface `IAuditLogReadRepository` để truy vấn audit logs từ MongoDB
- `RetentionPolicyWriteRepository`: Triển khai interface `IRetentionPolicyWriteRepository` để lưu trữ retention policies
- `RetentionPolicyReadRepository`: Triển khai interface `IRetentionPolicyReadRepository` để truy vấn retention policies

### Schemas

- `AuditLogEntrySchema`: Schema MongoDB cho bản ghi audit log
- `RetentionPolicySchema`: Schema MongoDB cho chính sách lưu trữ
- `InitiatorSchema`: Schema MongoDB cho thông tin người/hệ thống thực hiện hành động

### Factories

- `UuidIdFactory`: Triển khai interface `IUuidIdFactory` để tạo ID dạng UUID v7

## Cấu trúc thư mục

```
alm-infrastructure/
├── src/
│   └── lib/
│       ├── repositories/     # Triển khai các repository
│       ├── schemas/          # Schema MongoDB
│       ├── factories/        # Factory implementations
│       └── index.ts          # Export point
```

## Tính năng chính

- Lưu trữ và truy vấn audit logs sử dụng MongoDB
- Lưu trữ và truy vấn retention policies sử dụng MongoDB
- Chuyển đổi giữa domain model và persistence model
- Tạo unique ID cho các entity mới sử dụng UUID v7

## Ví dụ sử dụng thực tế

### 1. Cấu hình repository và schema trong NestJS module

```typescript
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuditLogEntryDocument, AuditLogEntrySchema, AuditLogWriteRepository, RetentionPolicyDocument, RetentionPolicySchema, RetentionPolicyWriteRepository, RetentionPolicyReadRepository, UuidIdFactory } from "@ecoma/alm-infrastructure";

// Định nghĩa token cho dependency injection
const AUDIT_LOG_WRITE_REPOSITORY = "AUDIT_LOG_WRITE_REPOSITORY";
const RETENTION_POLICY_WRITE_REPOSITORY = "RETENTION_POLICY_WRITE_REPOSITORY";
const RETENTION_POLICY_READ_REPOSITORY = "RETENTION_POLICY_READ_REPOSITORY";
const UUID_ID_FACTORY = "UUID_ID_FACTORY";

@Module({
  imports: [
    // Kết nối MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("app.mongodb.uri"),
        dbName: "audit-logs",
      }),
    }),

    // Đăng ký schema Mongoose
    MongooseModule.forFeature([
      { name: AuditLogEntryDocument.name, schema: AuditLogEntrySchema },
      { name: RetentionPolicyDocument.name, schema: RetentionPolicySchema },
    ]),
  ],
  providers: [
    // Đăng ký repositories
    {
      provide: AUDIT_LOG_WRITE_REPOSITORY,
      useClass: AuditLogWriteRepository,
    },
    {
      provide: RETENTION_POLICY_WRITE_REPOSITORY,
      useClass: RetentionPolicyWriteRepository,
    },
    {
      provide: RETENTION_POLICY_READ_REPOSITORY,
      useClass: RetentionPolicyReadRepository,
    },
    // Đăng ký factory
    {
      provide: UUID_ID_FACTORY,
      useClass: UuidIdFactory,
    },
  ],
  exports: [AUDIT_LOG_WRITE_REPOSITORY, RETENTION_POLICY_WRITE_REPOSITORY, RETENTION_POLICY_READ_REPOSITORY, UUID_ID_FACTORY],
})
export class InfrastructureModule {}
```

### 2. Sử dụng trong Command Handler

```typescript
import { Inject, Injectable } from "@nestjs/common";
import { AuditLogEntryFactory, IngestAuditLogDto } from "@ecoma/alm-application";
import { AuditLogWriteRepository, UuidIdFactory } from "@ecoma/alm-infrastructure";

@Injectable()
export class IngestAuditLogCommandHandler {
  constructor(
    @Inject("AUDIT_LOG_WRITE_REPOSITORY")
    private readonly auditLogWriteRepo: AuditLogWriteRepository,
    private readonly auditLogEntryFactory: AuditLogEntryFactory
  ) {}

  async execute(command: IngestAuditLogDto): Promise<void> {
    // Chuyển đổi DTO thành domain model
    const auditLogEntry = this.auditLogEntryFactory.create({
      timestamp: new Date(command.timestamp),
      initiator: command.initiator,
      boundedContext: command.boundedContext,
      actionType: command.actionType,
      // ... các thuộc tính khác
    });

    // Lưu vào database
    await this.auditLogWriteRepo.save(auditLogEntry);
  }
}
```

### 3. Sử dụng trong NestJS Controller với NATS

```typescript
import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { plainToInstance } from "class-transformer";
import { AlmIngestionApplicationService, IngestAuditLogDto } from "@ecoma/alm-application";

@Controller()
export class AuditLogController {
  constructor(private readonly almIngestionApplicationService: AlmIngestionApplicationService) {}

  @MessagePattern("alm.audit-log")
  async ingestAuditLog(payload: unknown) {
    // Chuyển đổi plain object từ NATS thành class instance
    const auditLogDto = plainToInstance(IngestAuditLogDto, payload);

    // Sử dụng application service
    await this.almIngestionApplicationService.persistAuditLogEntry(auditLogDto);

    return { success: true };
  }
}
```

### 4. Tích hợp UuidIdFactory với domain factory

```typescript
import { Inject, Injectable } from "@nestjs/common";
import { AuditLogEntryFactory } from "@ecoma/alm-application";
import { UuidIdFactory } from "@ecoma/alm-infrastructure";

@Injectable()
export class FactoriesProvider {
  @Inject("UUID_ID_FACTORY")
  private readonly uuidIdFactory: UuidIdFactory;

  provideAuditLogEntryFactory(): AuditLogEntryFactory {
    // Inject UuidIdFactory vào AuditLogEntryFactory
    return new AuditLogEntryFactory(this.uuidIdFactory);
  }
}
```

## Kết hợp với các module khác

`alm-infrastructure` là một phần của kiến trúc DDD 4-layer (Domain, Application, Infrastructure, UI/API), được sử dụng bởi các service như `alm-ingestion` để tương tác với cơ sở dữ liệu và các hệ thống bên ngoài. Module này triển khai các port định nghĩa trong `alm-application` và sử dụng domain model từ `alm-domain`.

## MongoDB Schema

### AuditLogEntry Schema

```typescript
@Schema({ versionKey: false, timestamps: false, _id: false })
export class InitiatorSchema {
  @Prop({ required: true, enum: ["User", "System", "Integration"] })
  type!: "User" | "System" | "Integration";

  @Prop({ required: true })
  name!: string;

  @Prop()
  id?: string;

  @Prop()
  ipAddress?: string;

  @Prop()
  userAgent?: string;
}

@Schema({ collection: "entries", versionKey: false, timestamps: false })
export class AuditLogEntryDocument extends Document {
  @Prop({ required: true, unique: true })
  override id!: string;

  @Prop({ required: true })
  timestamp!: Date;

  @Prop({ required: true, type: InitiatorSchema })
  initiator!: InitiatorSchema;

  @Prop({ required: true })
  boundedContext!: string;

  @Prop({ required: true })
  actionType!: string;

  @Prop()
  category?: string;

  @Prop()
  entityId?: string;

  @Prop()
  entityType?: string;

  @Prop()
  tenantId?: string;

  @Prop({ type: Object })
  contextData?: Record<string, unknown>;
}
```

### RetentionPolicy Schema

```typescript
@Schema({ collection: "retention-policies" })
export class RetentionPolicyDocument extends Document {
  @Prop({ required: true, unique: true })
  override id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  description?: string;

  @Prop()
  boundedContext?: string;

  @Prop()
  actionType?: string;

  @Prop()
  entityType?: string;

  @Prop()
  tenantId?: string;

  @Prop({ required: true })
  retentionDays!: number;

  @Prop({ required: true })
  isActive!: boolean;

  @Prop({ required: true })
  createdAt!: Date;

  @Prop()
  updatedAt?: Date;
}
```

## Dependencies

- @ecoma/alm-domain
- @ecoma/alm-application
- @ecoma/common-domain
- @ecoma/common-application
- mongoose
- @nestjs/mongoose
- uuid

## Testing

Để chạy unit tests:

```bash
nx test alm-infrastructure
```

Để chạy tests với coverage:

```bash
nx test alm-infrastructure --coverage
```

## Contributing

1. Tuân thủ coding standards và conventions của dự án
2. Viết unit tests cho mỗi repository implementation
3. Đảm bảo repository implementation thỏa mãn interface trong application layer
4. Cập nhật schema khi có thay đổi trong domain model

## Versioning

Module này tuân theo [Semantic Versioning](https://semver.org/). Các phiên bản được đánh số theo format MAJOR.MINOR.PATCH.

## License

Copyright © 2024 Ecoma. All rights reserved.
