import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { decryptFields } from "./decrypt-fields";
import { encryptFields } from "./encrypt-fields";
import type { EncryptionService } from "./encryption.service";
export const jsonValueSchema = z.json().openapi("JsonValue");
export const jsonObjectSchema = z.record(z.string(), jsonValueSchema);

const encryptedObjectSchema = z.record(z.string(), z.string());
const jsonResponseSchema: z.ZodType<Record<string, unknown>> = jsonObjectSchema;
const validationErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({ name: z.literal("ZodError"), message: z.string() }),
});

const encryptRoute = createRoute({
  method: "post",
  path: "/encrypt",
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: jsonObjectSchema },
      },
    },
  },
  responses: {
    200: {
      description: "JSON object with each top-level value encoded",
      content: {
        "application/json": { schema: encryptedObjectSchema },
      },
    },
    400: {
      description: "Request body is missing, malformed JSON, or not a JSON object",
      content: {
        "text/plain": { schema: z.string() },
        "application/json": { schema: validationErrorSchema },
      },
    },
    415: {
      description: "Request content type is not JSON",
      content: { "text/plain": { schema: z.string() } },
    },
  },
});

const decryptRoute = createRoute({
  method: "post",
  path: "/decrypt",
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: jsonObjectSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Original JSON object with encoded values decoded",
      content: {
        "application/json": { schema: jsonResponseSchema },
      },
    },
    400: {
      description: "Request body is missing, malformed JSON, or not a JSON object",
      content: {
        "text/plain": { schema: z.string() },
        "application/json": { schema: validationErrorSchema },
      },
    },
    415: {
      description: "Request content type is not JSON",
      content: { "text/plain": { schema: z.string() } },
    },
  },
});

export function createEncryptionRoutes(service: EncryptionService) {
  const routes = new OpenAPIHono();

  routes.openapi(encryptRoute, (context) => {
    const payload = context.req.valid("json");
    return context.json(encryptFields(payload, service), 200);
  });

  routes.openapi(decryptRoute, (context) => {
    const payload = context.req.valid("json");
    return context.json<Record<string, unknown>, 200>(decryptFields(payload, service), 200);
  });

  return routes;
}
