import { OpenAPIHono } from "@hono/zod-openapi";
import { base64EncryptionService } from "./features/encryption/base64-encryption.service";
import { createEncryptionRoutes } from "./features/encryption/route";

export function createApp() {
  const app = new OpenAPIHono();
  app.doc31("/openapi.json", {
    openapi: "3.1.0",
    info: {
      title: "Take-home Assignment Riot",
      version: "1.0.0",
    },
  });

  app.route("/", createEncryptionRoutes(base64EncryptionService));

  return app;
}
