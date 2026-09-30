export interface EncryptionService {
  encrypt(value: unknown): string;
  isEncoded(value: unknown): value is string;
  decrypt(value: string): unknown;
}
