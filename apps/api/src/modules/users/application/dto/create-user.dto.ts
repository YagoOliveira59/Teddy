import * as z from 'zod/v4';

export const CreateClientSchema = z.object({
  name: z
    .string()
    .min(3, { message: 'The name must be at least 3 characters long.' }),
  salary: z
    .number({ error: 'The salary must be a number.' })
    .min(0, { message: 'The salary cannot be negative.' }),
  companyValue: z
    .number({ error: 'The company value must be a number.' })
    .min(0, { message: 'The company value cannot be negative.' }),
});

export type CreateClientDto = z.infer<typeof CreateClientSchema>;
