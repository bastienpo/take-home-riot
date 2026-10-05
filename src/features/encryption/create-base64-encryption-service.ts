import type { EncryptionService } from "./encryption.service";
import type { JsonValue } from "./dto";
import { z } from "zod";

export function createBase64EncryptionService(): EncryptionService {
  function encrypt(value: JsonValue): string {
    return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
  }

  function decrypt(value: string): JsonValue {
    return z.json().parse(JSON.parse(Buffer.from(value, "base64").toString("utf8")));
  }

  function isEncoded(value: unknown): value is string {
    if (typeof value !== "string") {
      return false;
    }

    const decoded = Buffer.from(value, "base64");
    if (decoded.toString("base64") !== value) {
      return false;
    }

    try {
      z.json().parse(JSON.parse(decoded.toString("utf8")));
      return true;
    } catch {
      return false;
    }
  }

  return { encrypt, decrypt, isEncoded };
}
