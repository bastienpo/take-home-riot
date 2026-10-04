import { z } from "@hono/zod-openapi";

export const signRequestSchema = z.json().openapi("SignRequest");
export type SignRequest = z.infer<typeof signRequestSchema>;

export const verifyRequestSchema = z
  .object({ signature: z.string(), data: signRequestSchema })
  .openapi("VerifyRequest");

export const signResponseSchema = z.object({ signature: z.string() }).openapi("SignResponse");
export type SignResponse = z.infer<typeof signResponseSchema>;
