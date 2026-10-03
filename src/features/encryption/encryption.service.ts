import type { JsonValue } from "./json.schema";

export interface EncryptionService {
  encrypt(value: JsonValue): string;
  isEncoded(value: unknown): value is string;
  decrypt(value: string): JsonValue;
}
