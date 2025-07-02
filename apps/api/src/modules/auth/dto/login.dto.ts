import * as z from 'zod/v4';

export const loginSchema = z.object({
  email: z.email({ message: 'A valid email is required.' }),
  password: z.string().min(1, { message: 'Password cannot be empty.' }),
});

export type LoginDto = z.infer<typeof loginSchema>;
