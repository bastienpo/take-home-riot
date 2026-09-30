import type { EncryptionService } from "./encryption.service";

export const base64EncryptionService: EncryptionService = {
  encrypt(value: unknown): string {
    return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
  },

  decrypt(value: string): unknown {
    return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
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
      JSON.parse(decoded.toString("utf8"));
      return true;
    } catch {
      return false;
    }
  },
};
