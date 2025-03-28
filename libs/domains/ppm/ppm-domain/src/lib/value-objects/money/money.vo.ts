/**
 * Money Value Object biểu diễn một giá trị tiền tệ với số tiền và loại tiền tệ
 */
export class Money {
  private constructor(
    private readonly _amount: number,
    private readonly _currency: string
  ) {
    // Kiểm tra số tiền hợp lệ
    if (_amount < 0) {
      throw new Error('Số tiền không được âm');
    }

    // Kiểm tra loại tiền tệ hợp lệ (3 ký tự theo chuẩn ISO 4217)
    if (!_currency || _currency.length !== 3) {
      throw new Error('Loại tiền tệ không hợp lệ');
    }
  }

  /**
   * Tạo một đối tượng Money mới
   * @param amount - Số tiền
   * @param currency - Loại tiền tệ (mã ISO 4217 3 ký tự)
   * @returns Đối tượng Money mới
   */
  public static create(amount: number, currency: string): Money {
    return new Money(amount, currency);
  }

  /**
   * Lấy số tiền
   */
  public get amount(): number {
    return this._amount;
  }

  /**
   * Lấy loại tiền tệ
   */
  public get currency(): string {
    return this._currency;
  }

  /**
   * So sánh với một đối tượng Money khác
   * @param other - Đối tượng Money cần so sánh
   * @returns true nếu hai đối tượng Money bằng nhau
   */
  public equals(other: Money): boolean {
    if (!(other instanceof Money)) {
      return false;
    }

    return this._amount === other.amount && this._currency === other.currency;
  }

  /**
   * Cộng với một đối tượng Money khác
   * @param other - Đối tượng Money cần cộng
   * @returns Đối tượng Money mới sau khi cộng
   * @throws Error nếu loại tiền tệ khác nhau
   */
  public add(other: Money): Money {
    if (this._currency !== other.currency) {
      throw new Error('Không thể cộng hai loại tiền tệ khác nhau');
    }

    return Money.create(this._amount + other.amount, this._currency);
  }

  /**
   * Trừ đi một đối tượng Money khác
   * @param other - Đối tượng Money cần trừ
   * @returns Đối tượng Money mới sau khi trừ
   * @throws Error nếu loại tiền tệ khác nhau hoặc kết quả là số âm
   */
  public subtract(other: Money): Money {
    if (this._currency !== other.currency) {
      throw new Error('Không thể trừ hai loại tiền tệ khác nhau');
    }

    const result = this._amount - other.amount;
    if (result < 0) {
      throw new Error('Kết quả trừ không được âm');
    }

    return Money.create(result, this._currency);
  }

  /**
   * Chuyển đổi sang object đơn giản cho serialization
   */
  public toObject(): { amount: number; currency: string } {
    return {
      amount: this._amount,
      currency: this._currency,
    };
  }

  /**
   * Chuyển đối tượng Money thành chuỗi
   */
  public toString(): string {
    return `${this._amount} ${this._currency}`;
  }
}
