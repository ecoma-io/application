# Interface: IValidator\<T\>

Interface định nghĩa Validator pattern trong Domain Driven Design.
Validator chịu trách nhiệm validate các đối tượng domain.

## Example

```typescript
class OrderValidator implements IValidator<Order> {
  validate(order: Order): IValidatorResult {
    const errors: IValidatorError[] = [];

    if (!order.customerId) {
      errors.push({
        field: "customerId",
        code: "REQUIRED",
        message: "Customer ID is required",
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
```

## Type Parameters

### T

`T`

Kiểu dữ liệu của đối tượng cần validate

## Methods

<a id="validate"></a>

### validate()

> **validate**(`target`): [`IValidatorResult`](/libraries/common-domain/Interface.IValidatorResult.md)

Validate một đối tượng domain

#### Parameters

##### target

`T`

Đối tượng cần validate

#### Returns

[`IValidatorResult`](/libraries/common-domain/Interface.IValidatorResult.md)

Kết quả validation
