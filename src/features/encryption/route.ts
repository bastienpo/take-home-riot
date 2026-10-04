import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { decryptFields } from "./decrypt-fields";
import { encryptFields } from "./encryp-fields";
import type { EncryptionService } from "./encryption.service";
import { jsonObjectSchema } from "./dto";

const encryptedObjectSchema = z.record(z.string(), z.string());
const jsonResponseSchema: z.ZodType<Record<string, unknown>> = jsonObjectSchema;

const encryptRoute = createRoute({
  method: "post",
  path: "/encrypt",
  request: {
    body: {
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
      description: "Request body is malformed JSON or is not a JSON object",
    },
  },
});

const decryptRoute = createRoute({
  method: "post",
  path: "/decrypt",
  request: {
    body: {
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
      description: "Request body is malformed JSON or is not a JSON object",
    },
  },
});

export function createEncryptionRoutes(service: EncryptionService) {
  const routes = new OpenAPIHono();

  routes.openapi(encryptRoute, (context) => {
    const payload = context.req.valid("json");
    return context.json(encryptFields(payload, service));
  });

  routes.openapi(decryptRoute, (context) => {
    const payload = context.req.valid("json");
    return context.json<Record<string, unknown>>(decryptFields(payload, service));
  });

  return routes;
}
