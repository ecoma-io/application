# Class: PinoLogger

Service cung cấp logging cho NestJS dựa trên Pino.
Lớp này triển khai LoggerService của NestJS và sử dụng Pino làm backend.

## Since

1.0.0

## Implements

## Example

```typescript
// Sử dụng làm logger toàn cục
const app = await NestFactory.create(AppModule);
app.useLogger(new NestjsLogger('AppName'));

// Sử dụng thông qua dependency injection
@Injectable()
class MyService {
  constructor(@Inject(NestjsLogger) private logger: NestjsLogger) {
    this.logger.setContext('MyService');
  }

  doSomething() {
    this.logger.info('Đang xử lý tác vụ');
  }
}
```

## Implements

- `LoggerService`

## Constructors

<a id="constructor"></a>

### Constructor

> **new PinoLogger**(`context?`): `PinoLogger`

Tạo một instance mới của NestjsLogger

#### Parameters

##### context?

`string`

Context của logger, thường là tên của module/service

#### Returns

`PinoLogger`

## Methods

<a id="debug"></a>

### debug()

> **debug**(`message`, ...`optionalParams`): `void`

Ghi log ở cấp độ debug

#### Parameters

##### message

`any`

Thông điệp cần ghi log

##### optionalParams

...`any`[]

Các tham số tùy chọn, tham số cuối cùng có thể là context

#### Returns

`void`

#### Implementation of

`LoggerService.debug`

---

<a id="error"></a>

### error()

> **error**(`message`, ...`optionalParams`): `void`

Ghi log ở cấp độ error

#### Parameters

##### message

`any`

Thông điệp cần ghi log, có thể là Error object

##### optionalParams

...`any`[]

Các tham số tùy chọn, tham số cuối cùng có thể là context

#### Returns

`void`

#### Implementation of

`LoggerService.error`

---

<a id="fatal"></a>

### fatal()

> **fatal**(`message`, ...`optionalParams`): `void`

Ghi log ở cấp độ fatal

#### Parameters

##### message

`any`

Thông điệp cần ghi log

##### optionalParams

...`any`[]

Các tham số tùy chọn, tham số cuối cùng có thể là context

#### Returns

`void`

#### Implementation of

`LoggerService.fatal`

---

<a id="info"></a>

### info()

> **info**(`message`, ...`optionalParams`): `void`

Ghi log ở cấp độ info

#### Parameters

##### message

`any`

Thông điệp cần ghi log

##### optionalParams

...`any`[]

Các tham số tùy chọn, tham số cuối cùng có thể là context

#### Returns

`void`

---

<a id="log"></a>

### log()

> **log**(`message`, ...`optionalParams`): `void`

Ghi log ở cấp độ info (alias của info để tương thích với LoggerService của NestJS)

#### Parameters

##### message

`any`

Thông điệp cần ghi log

##### optionalParams

...`any`[]

Các tham số tùy chọn, tham số cuối cùng có thể là context

#### Returns

`void`

#### Implementation of

`LoggerService.log`

---

<a id="warn"></a>

### warn()

> **warn**(`message`, ...`optionalParams`): `void`

Ghi log ở cấp độ warn

#### Parameters

##### message

`any`

Thông điệp cần ghi log

##### optionalParams

...`any`[]

Các tham số tùy chọn, tham số cuối cùng có thể là context

#### Returns

`void`

#### Implementation of

`LoggerService.warn`
