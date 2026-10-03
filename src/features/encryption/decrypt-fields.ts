import { mapValues } from "es-toolkit/object";
import type { EncryptionService } from "./encryption.service";
import type { JsonObject, JsonValue } from "./json.schema";

export function decryptFields(input: JsonObject, service: EncryptionService): JsonObject {
  const decryptIfEncoded = (value: JsonValue) =>
    service.isEncoded(value) ? service.decrypt(value) : value;

  return mapValues(input, decryptIfEncoded);
}
