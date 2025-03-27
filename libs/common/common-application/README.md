# @ecoma/common-application

Thư viện này cung cấp các building blocks và patterns cho tầng Application trong kiến trúc DDD/Clean Architecture, giúp chuẩn hóa cách xây dựng các use case, command, query, service, error... dùng chung cho các ứng dụng trong hệ thống Ecoma.

## Cài đặt

Thư viện đã được cài đặt sẵn trong monorepo. Import các thành phần cần thiết:

```typescript
import { ICommand, CommandHandler, IQuery, QueryHandler, ApplicationService } from '@ecoma/common-application';
```

## Cấu trúc thư viện

```
src/lib/
  commands/   # CQRS Commands, CommandHandler, CommandBus
  queries/    # CQRS Queries, QueryHandler, QueryBus
  dtos/       # Data Transfer Objects
  errors/     # Application-level errors
  ports/      # Input ports (interfaces)
  services/   # Application services, logger
```

## Các thành phần chính

- **Commands**: Định nghĩa các hành động thay đổi trạng thái hệ thống (ICommand, CommandHandler, CommandBus...)
- **Queries**: Định nghĩa các truy vấn lấy dữ liệu (IQuery, QueryHandler, QueryBus...)
- **DTOs**: Chuẩn hóa dữ liệu truyền vào/ra giữa các tầng
- **Errors**: Chuẩn hóa lỗi ở tầng Application (ApplicationError, CommandError, QueryError)
- **Ports**: Định nghĩa các interface cho input (InputPort...)
- **Services**: ApplicationService, LoggerService interface

### Ví dụ sử dụng

#### Commands
```typescript
import { ICommand, CommandHandler } from '@ecoma/common-application';

class CreateUserCommand implements ICommand {
  constructor(public readonly username: string, public readonly password: string, public readonly version = '1') {}
}

@CommandHandler(CreateUserCommand)
class CreateUserHandler {
  async execute(command: CreateUserCommand) {
    // Xử lý tạo user
  }
}
```

#### Queries
```typescript
import { IQuery, QueryHandler } from '@ecoma/common-application';

class GetUserQuery implements IQuery {
  constructor(public readonly userId: string) {}
}

@QueryHandler(GetUserQuery)
class GetUserHandler {
  async execute(query: GetUserQuery) {
    // Truy vấn user theo ID
  }
}
```

#### DTOs
```typescript
import { DTO } from '@ecoma/common-application';

class UserDto extends DTO {
  constructor(public readonly id: string, public readonly username: string) {
    super();
  }
}
```

#### Errors
```typescript
import { ApplicationError } from '@ecoma/common-application';

class UserAlreadyExistsError extends ApplicationError {
  constructor(username: string) {
    super(`User ${username} already exists`);
  }
}
```

#### Ports
```typescript
import { InputPort } from '@ecoma/common-application';

export interface IUserInputPort extends InputPort {
  createUser(username: string, password: string): Promise<void>;
}
```

#### Services
```typescript
import { ApplicationService } from '@ecoma/common-application';

export class UserService implements ApplicationService {
  // Triển khai các logic nghiệp vụ ứng dụng
}
```

## Xây dựng và kiểm thử

```bash
nx build common-application
nx test common-application
```
