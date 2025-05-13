export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

export const IPasswordHasher = Symbol('IPasswordHasher');
