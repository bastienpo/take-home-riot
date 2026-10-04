import { mapValues, sortKeys } from "es-toolkit";
import type { SignRequest } from "./dto";

export function sortJsonKeys(value: SignRequest): SignRequest {
  if (Array.isArray(value)) {
    return value.map(sortJsonKeys);
  }

  if (value !== null && typeof value === "object") {
    return mapValues(sortKeys(value), sortJsonKeys);
  }

  return value;
}
