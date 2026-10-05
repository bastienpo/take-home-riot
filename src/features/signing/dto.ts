import type { z } from "zod";
import type { signRequestSchema } from "./create-signing-routes";

export type SignRequest = z.infer<typeof signRequestSchema>;
