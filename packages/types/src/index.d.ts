import { z } from "zod";
export declare const clientSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    salary: z.ZodNumber;
    companyValue: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    salary: number;
    companyValue: number;
    createdAt: string;
    updatedAt: string;
}, {
    id: string;
    name: string;
    salary: number;
    companyValue: number;
    createdAt: string;
    updatedAt: string;
}>;
export type Client = z.infer<typeof clientSchema>;
export declare const createClientSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodString;
    salary: z.ZodNumber;
    companyValue: z.ZodNumber;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    name: string;
    salary: number;
    companyValue: number;
}, {
    name: string;
    salary: number;
    companyValue: number;
}>;
export type CreateClientDto = z.infer<typeof createClientSchema>;
export declare const updateClientSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    salary: z.ZodOptional<z.ZodNumber>;
    companyValue: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    salary?: number | undefined;
    companyValue?: number | undefined;
}, {
    name?: string | undefined;
    salary?: number | undefined;
    companyValue?: number | undefined;
}>;
export type UpdateClientDto = z.infer<typeof updateClientSchema>;
