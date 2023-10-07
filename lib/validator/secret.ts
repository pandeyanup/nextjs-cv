import { z } from "zod";

export const LoginValidator = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(12),
});

export type TLoginPayload = z.infer<typeof LoginValidator>;
