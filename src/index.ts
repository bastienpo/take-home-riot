import { serve } from "bun";
import { createApp } from "./app";
import { env } from "./env";

const app = createApp();

serve({
  fetch: app.fetch,
  port: env.PORT,
});

console.log(`Server listening on port ${env.PORT}`);
