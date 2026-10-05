import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import { signObject } from "./sign-object";
import { verifyObject } from "./verify-object";
import type { SigningService } from "./signing.service";

export const signRequestSchema = z.json().openapi("SignRequest");
const verifyRequestSchema = z
  .object({ signature: z.string(), data: signRequestSchema })
  .openapi("VerifyRequest");
const signResponseSchema = z.object({ signature: z.string() }).openapi("SignResponse");
const errorResponseSchema = z.object({ error: z.string() });

const signRoute = createRoute({
  method: "post",
  path: "/sign",
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: signRequestSchema },
      },
    },
  },
  responses: {
    200: {
      description: "Signature of the JSON data",
      content: {
        "application/json": { schema: signResponseSchema },
      },
    },
    400: {
      description: "Request body is missing or malformed JSON",
      content: { "text/plain": { schema: z.string() } },
    },
    415: {
      description: "Request content type is not JSON",
      content: { "text/plain": { schema: z.string() } },
    },
  },
});

const verifyRoute = createRoute({
  method: "post",
  path: "/verify",
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: verifyRequestSchema },
      },
    },
  },
  responses: {
    204: {
      description: "Signature is valid",
    },
    400: {
      description: "Request body is missing, malformed JSON, or the signature is invalid",
      content: {
        "text/plain": { schema: z.string() },
        "application/json": { schema: errorResponseSchema },
      },
    },
    415: {
      description: "Request content type is not JSON",
      content: { "text/plain": { schema: z.string() } },
    },
    422: {
      description: "Request body does not match the verification DTO",
      content: {
        "application/json": { schema: errorResponseSchema },
      },
    },
  },
});

export function createSigningRoutes(service: SigningService) {
  const routes = new OpenAPIHono();

  routes.openapi(signRoute, (context) => {
    const payload = context.req.valid("json");
    return context.json({ signature: signObject(payload, service) }, 200);
  });

  routes.openapi(
    verifyRoute,
    (context) => {
      const { data, signature } = context.req.valid("json");
      if (!verifyObject(data, signature, service)) {
        return context.json({ error: "Invalid signature" }, 400);
      }

      return context.body(null, 204);
    },
    (result, context) => {
      if (!result.success) {
        return context.json({ error: "Invalid request body" }, 422);
      }
    },
  );

  return routes;
}
