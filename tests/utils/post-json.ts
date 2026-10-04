import { OpenAPIHono } from "@hono/zod-openapi";

export function postJson(app: OpenAPIHono, path: string, body: string) {
  return app.request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });
}
