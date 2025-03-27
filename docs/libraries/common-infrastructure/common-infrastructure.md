# @ecoma/common-infrastructure

Thư viện này cung cấp các building blocks cho tầng Infrastructure dùng chung trong hệ thống Ecoma, giúp chuẩn hóa các giải pháp về persistence, messaging, caching, security, error handling...

## Cài đặt

Thư viện đã được cài đặt sẵn trong monorepo. Import các thành phần cần thiết:

```typescript
import { IPersistence, IMessageBus, ICacheProvider, ISecurityService } from "@ecoma/common-infrastructure";
```

## Cấu trúc thư viện

```
src/lib/
  persistence/   # Các interface và implement lưu trữ dữ liệu
  messaging/     # Messaging bus, event publisher/subscriber
  caching/       # Caching provider
  security/      # Security, encryption, hash...
  errors/        # Infrastructure-level errors
```

## Các thành phần chính

- **Persistence**: IPersistence, IRepository, các implement cho database
- **Messaging**: IMessageBus, event publisher/subscriber
- **Caching**: ICacheProvider, các implement cho Redis, memory...
- **Security**: ISecurityService, các hàm mã hóa, hash, kiểm tra quyền
- **Errors**: Chuẩn hóa lỗi tầng infrastructure

### Ví dụ sử dụng

#### Persistence

```typescript
import { IPersistence } from "@ecoma/common-infrastructure";

class UserRepository implements IPersistence {
  async save(entity: any) {
    // Lưu entity vào database
  }
  async findById(id: string) {
    // Truy vấn entity theo id
  }
}
```

#### Messaging

```typescript
import { IMessageBus } from "@ecoma/common-infrastructure";

class MyMessageBus implements IMessageBus {
  async publish(topic: string, message: any) {
    // Gửi message tới topic
  }
  async subscribe(topic: string, handler: (msg: any) => void) {
    // Đăng ký nhận message
  }
}
```

#### Caching

```typescript
import { ICacheProvider } from "@ecoma/common-infrastructure";

class RedisCacheProvider implements ICacheProvider {
  async get(key: string) {
    // Lấy giá trị từ Redis
  }
  async set(key: string, value: any) {
    // Lưu giá trị vào Redis
  }
}
```

#### Security

```typescript
import { ISecurityService } from "@ecoma/common-infrastructure";

class MySecurityService implements ISecurityService {
  hashPassword(password: string): string {
    // Hash password
    return "hashed-" + password;
  }
  verifyPassword(password: string, hash: string): boolean {
    // Kiểm tra password
    return hash === "hashed-" + password;
  }
}
```

#### Errors

```typescript
import { InfrastructureError } from "@ecoma/common-infrastructure";

class DatabaseConnectionError extends InfrastructureError {
  constructor(message: string) {
    super(message);
  }
}
```

## Xây dựng và kiểm thử

```bash
nx build common-infrastructure
nx test common-infrastructure
```

## Classes

- [CommandPublisher](/libraries/common-infrastructure/Class.CommandPublisher.md)
- [DomainEventPublisher](/libraries/common-infrastructure/Class.DomainEventPublisher.md)
- [InfrastructureError](/libraries/common-infrastructure/Class.InfrastructureError.md)
- [MessagePublisher](/libraries/common-infrastructure/Class.MessagePublisher.md)
- [RedisCacheStrategy](/libraries/common-infrastructure/Class.RedisCacheStrategy.md)

## Variables

- [CACHE_KEY_METADATA](/libraries/common-infrastructure/Variable.CACHE_KEY_METADATA.md)
- [RedisProvider](/libraries/common-infrastructure/Variable.RedisProvider.md)

## Functions

- [Cache](/libraries/common-infrastructure/Function.Cache.md)
