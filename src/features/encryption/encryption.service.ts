import type { JsonValue } from "./dto";

export interface EncryptionService {
  encrypt(value: JsonValue): string;
  isEncoded(value: unknown): value is string;
  decrypt(value: string): JsonValue;
}
