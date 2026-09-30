import { mapValues } from "es-toolkit/object";
import type { EncryptionService } from "./encryption.service";

export function decryptFields(
  input: Record<string, unknown>,
  service: EncryptionService,
): Record<string, unknown> {
  const decryptIfEncoded = (value: unknown) =>
    service.isEncoded(value) ? service.decrypt(value) : value;

  return mapValues(input, decryptIfEncoded);
}
