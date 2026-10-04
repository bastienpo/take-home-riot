import { mapValues } from "es-toolkit/object";
import type { EncryptionService } from "./encryption.service";
import type { JsonObject } from "./dto";

export function encryptFields(
  input: JsonObject,
  service: EncryptionService,
): Record<string, string> {
  return mapValues(input, (value) => service.encrypt(value));
}
