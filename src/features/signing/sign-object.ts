import type { SignRequest } from "./dto";
import type { SigningService } from "./signing.service";
import { sortJsonKeys } from "./sortkeys.utils";

export function signObject(input: SignRequest, service: SigningService): string {
  return service.sign(sortJsonKeys(input));
}
