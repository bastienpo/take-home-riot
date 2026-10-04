import type { SignRequest } from "./dto";

export interface SigningService {
  sign(value: SignRequest): string;
  verify(value: SignRequest, signature: string): boolean;
}
