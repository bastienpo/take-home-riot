import { z } from "@hono/zod-openapi";

export const jsonValueSchema = z.json().openapi("JsonValue");
export const jsonObjectSchema = z.record(z.string(), jsonValueSchema);

export type JsonValue = z.infer<typeof jsonValueSchema>;
export type JsonObject = z.infer<typeof jsonObjectSchema>;
