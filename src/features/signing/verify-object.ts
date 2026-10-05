import type { SignRequest } from "./dto";
import type { SigningService } from "./signing.service";
import { sortJsonKeys } from "./sortkeys.utils";

export function verifyObject(
  input: SignRequest,
  signature: string,
  service: SigningService,
): boolean {
  return service.verify(sortJsonKeys(input), signature);
}
