# @ecoma/common-application

Thư viện này cung cấp các building blocks và patterns cho tầng Application trong kiến trúc DDD/Clean Architecture, giúp chuẩn hóa cách xây dựng các use case, command, query, service, error... dùng chung cho các ứng dụng trong hệ thống Ecoma.

## Cài đặt

Thư viện đã được cài đặt sẵn trong monorepo. Import các thành phần cần thiết:

```typescript
import { ICommand, CommandHandler, IQuery, QueryHandler, ApplicationService } from "@ecoma/common-application";
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
import { ICommand, CommandHandler } from "@ecoma/common-application";

class CreateUserCommand implements ICommand {
  constructor(public readonly username: string, public readonly password: string, public readonly version = "1") {}
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
import { IQuery, QueryHandler } from "@ecoma/common-application";

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
import { DTO } from "@ecoma/common-application";

class UserDto extends DTO {
  constructor(public readonly id: string, public readonly username: string) {
    super();
  }
}
```

#### Errors

```typescript
import { ApplicationError } from "@ecoma/common-application";

class UserAlreadyExistsError extends ApplicationError {
  constructor(username: string) {
    super(`User ${username} already exists`);
  }
}
```

#### Ports

```typescript
import { InputPort } from "@ecoma/common-application";

export interface IUserInputPort extends InputPort {
  createUser(username: string, password: string): Promise<void>;
}
```

#### Services

```typescript
import { ApplicationService } from "@ecoma/common-application";

export class UserService implements ApplicationService {
  // Triển khai các logic nghiệp vụ ứng dụng
}
```

## Xây dựng và kiểm thử

```bash
nx build common-application
nx test common-application
```

## Enumerations

- [PaginationType](/libraries/common-application/Enumeration.PaginationType.md)
- [SortDirection](/libraries/common-application/Enumeration.SortDirection.md)

## Classes

- [AbstractAggregateFactory](/libraries/common-application/Class.AbstractAggregateFactory.md)
- [AbstractCommandUseCase](/libraries/common-application/Class.AbstractCommandUseCase.md)
- [AbstractLogger](/libraries/common-application/Class.AbstractLogger.md)
- [AbstractQueryUseCase](/libraries/common-application/Class.AbstractQueryUseCase.md)
- [ApplicationError](/libraries/common-application/Class.ApplicationError.md)
- [ApplicationValidationError](/libraries/common-application/Class.ApplicationValidationError.md)
- [CriteriaQueryDTO](/libraries/common-application/Class.CriteriaQueryDTO.md)
- [CriteriaQueryFilterDTO](/libraries/common-application/Class.CriteriaQueryFilterDTO.md)
- [CriteriaQueryLogicalDTO](/libraries/common-application/Class.CriteriaQueryLogicalDTO.md)
- [CriteriaQueryPaginationDTO](/libraries/common-application/Class.CriteriaQueryPaginationDTO.md)
- [CriteriaQuerySortDTO](/libraries/common-application/Class.CriteriaQuerySortDTO.md)
- [CursorPagination](/libraries/common-application/Class.CursorPagination.md)
- [CusorBasedPaginatedDTO](/libraries/common-application/Class.CusorBasedPaginatedDTO.md)
- [DataTransferObject](/libraries/common-application/Class.DataTransferObject.md)
- [GenericResult](/libraries/common-application/Class.GenericResult.md)
- [OffsetBasedPaginatedDTO](/libraries/common-application/Class.OffsetBasedPaginatedDTO.md)

## Interfaces

- [IComparisonCondition](/libraries/common-application/Interface.IComparisonCondition.md)
- [IGeospatialCondition](/libraries/common-application/Interface.IGeospatialCondition.md)
- [IInclusionCondition](/libraries/common-application/Interface.IInclusionCondition.md)
- [ILogicalCriteria](/libraries/common-application/Interface.ILogicalCriteria.md)
- [INullCheckCondition](/libraries/common-application/Interface.INullCheckCondition.md)
- [IPoint](/libraries/common-application/Interface.IPoint.md)
- [IRangeCondition](/libraries/common-application/Interface.IRangeCondition.md)
- [IReadRepository](/libraries/common-application/Interface.IReadRepository.md)
- [ISnowflakeIdFactory](/libraries/common-application/Interface.ISnowflakeIdFactory.md)
- [IStringCondition](/libraries/common-application/Interface.IStringCondition.md)
- [IUuidIdFactory](/libraries/common-application/Interface.IUuidIdFactory.md)
- [IWithinDistanceValue](/libraries/common-application/Interface.IWithinDistanceValue.md)
- [IWriteRepository](/libraries/common-application/Interface.IWriteRepository.md)

## Type Aliases

- [ComparisonOperator](/libraries/common-application/TypeAlias.ComparisonOperator.md)
- [FilterCondition](/libraries/common-application/TypeAlias.FilterCondition.md)
- [FilterCriteria](/libraries/common-application/TypeAlias.FilterCriteria.md)
- [FilterOperator](/libraries/common-application/TypeAlias.FilterOperator.md)
- [GeospatialOperator](/libraries/common-application/TypeAlias.GeospatialOperator.md)
- [InclusionOperator](/libraries/common-application/TypeAlias.InclusionOperator.md)
- [Nullable](/libraries/common-application/TypeAlias.Nullable.md)
- [NullOperator](/libraries/common-application/TypeAlias.NullOperator.md)
- [RangeOperator](/libraries/common-application/TypeAlias.RangeOperator.md)
- [StringOperator](/libraries/common-application/TypeAlias.StringOperator.md)

## Functions

- [CursorPaginationField](/libraries/common-application/Function.CursorPaginationField.md)
- [IsValidFilterTree](/libraries/common-application/Function.IsValidFilterTree.md)
