import type { z } from "zod";
import type { jsonValueSchema, jsonObjectSchema } from "./create-encryption-routes";

export type JsonValue = z.infer<typeof jsonValueSchema>;
export type JsonObject = z.infer<typeof jsonObjectSchema>;
