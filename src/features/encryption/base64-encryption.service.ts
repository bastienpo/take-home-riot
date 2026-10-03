import type { EncryptionService } from "./encryption.service";
import { jsonValueSchema, type JsonValue } from "./json.schema";

export const base64EncryptionService: EncryptionService = {
  encrypt(value: JsonValue): string {
    return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
  },

  decrypt(value: string): JsonValue {
    return jsonValueSchema.parse(JSON.parse(Buffer.from(value, "base64").toString("utf8")));
  },

  isEncoded(value: unknown): value is string {
    if (typeof value !== "string") {
      return false;
    }

    const decoded = Buffer.from(value, "base64");
    if (decoded.toString("base64") !== value) {
      return false;
    }

    try {
      jsonValueSchema.parse(JSON.parse(decoded.toString("utf8")));
      return true;
    } catch {
      return false;
    }
  },
};
