import { timingSafeEqual } from "node:crypto";
import type { SignRequest } from "./dto";
import type { SigningService } from "./signing.service";

export function createHmacSigningService(secret: string): SigningService {
  function sign(value: SignRequest): string {
    return new Bun.CryptoHasher("sha256", secret).update(JSON.stringify(value)).digest("hex");
  }

  function verify(value: SignRequest, signature: string): boolean {
    if (!/^[0-9a-f]{64}$/i.test(signature)) {
      return false;
    }

    return timingSafeEqual(Buffer.from(sign(value), "hex"), Buffer.from(signature, "hex"));
  }

  return { sign, verify };
}
