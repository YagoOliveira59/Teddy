import * as z from "zod/v4";
export declare const clientSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    salary: z.ZodNumber;
    companyValue: z.ZodNumber;
    creatorId: z.ZodUUID;
    users: z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodUUID;
        name: z.ZodString;
        email: z.ZodEmail;
    }, z.core.$strip>>>;
    createdAt: z.ZodISODateTime;
    updatedAt: z.ZodISODateTime;
}, z.core.$strip>;
export declare const createClientSchema: z.ZodObject<{
    name: z.ZodString;
    salary: z.ZodNumber;
    companyValue: z.ZodNumber;
}, z.core.$strip>;
export declare const updateClientSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    salary: z.ZodOptional<z.ZodNumber>;
    companyValue: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type Client = z.infer<typeof clientSchema>;
export type CreateClient = z.infer<typeof createClientSchema>;
export type UpdateClient = z.infer<typeof updateClientSchema>;
export declare class CreateClientDto {
    name: string;
    salary: number;
    companyValue: number;
}
export declare class UpdateClientDto {
    name?: string;
    salary?: number;
    companyValue?: number;
}
export declare const userSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    email: z.ZodEmail;
    passwordHash: z.ZodString;
    createdAt: z.ZodISODateTime;
    updatedAt: z.ZodISODateTime;
}, z.core.$strip>;
export declare const userDtoSchema: z.ZodObject<{
    id: z.ZodUUID;
    name: z.ZodString;
    email: z.ZodEmail;
    createdAt: z.ZodISODateTime;
    updatedAt: z.ZodISODateTime;
}, z.core.$strip>;
export declare const createUserSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.core.$strip>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type User = z.infer<typeof userSchema>;
export type UserDto = z.infer<typeof userDtoSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
}
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export declare const loginSchema: z.ZodObject<{
    email: z.ZodEmail;
    password: z.ZodString;
}>;
export declare const loginResponseSchema: z.ZodObject<{
    accessToken: z.ZodString;
}, z.core.$strip>;
export declare const jwtPayloadSchema: z.ZodObject<{
    sub: z.ZodUUID;
    email: z.ZodEmail;
}, z.core.$strip>;
export type Login = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type JwtPayload = z.infer<typeof jwtPayloadSchema>;
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class LoginResponseDto {
    accessToken: string;
}
export {};
//# sourceMappingURL=index.d.ts.map