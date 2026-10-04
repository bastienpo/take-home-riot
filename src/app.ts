import { OpenAPIHono } from "@hono/zod-openapi";
import { env } from "./env";
import { base64EncryptionService } from "./features/encryption/base64-encryption.service";
import { createEncryptionRoutes } from "./features/encryption/route";
import { createHmacSigningService } from "./features/signing/hmac-signing.service";
import { createSigningRoutes } from "./features/signing/route";
import { Scalar } from "@scalar/hono-api-reference";

const OPENAPI_URL = "/openapi.json";

export function createApp() {
  const app = new OpenAPIHono();

  app.on("POST", ["/encrypt", "/decrypt", "/sign", "/verify"], async (context, next) => {
    if (context.req.raw.body === null) {
      return context.text("Request body is required", 400);
    }

    await next();
  });

  app.get("/scalar", Scalar({ url: OPENAPI_URL }));

  app.doc31(OPENAPI_URL, {
    openapi: "3.1.0",
    info: {
      title: "Take-home Assignment Riot",
      version: "1.0.0",
    },
  });

  app.route("/", createEncryptionRoutes(base64EncryptionService));
  app.route("/", createSigningRoutes(createHmacSigningService(env.HMAC_SECRET)));

  return app;
}
