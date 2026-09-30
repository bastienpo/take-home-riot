import { mapValues } from "es-toolkit/object";
import type { EncryptionService } from "./encryption.service";

export function encryptFields(
  input: Record<string, unknown>,
  service: EncryptionService,
): Record<string, string> {
  return mapValues(input, (value) => service.encrypt(value));
}
