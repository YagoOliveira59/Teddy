import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsString, IsInt, IsNotEmpty, MinLength, IsEmail } from "class-validator";
import * as z from "zod/v4";


// Client Schema Definitions
export const clientSchema = z.object({
  id: z.uuid(),
  name: z
    .string()
    .min(3, { message: "The name must have at least 3 characters." }),
  salary: z
    .number()
    .positive({ message: "The salary must be a positive number." }),
  companyValue: z
    .number()
    .positive({ message: "The company value must be a positive number." }),
  creatorId: z.uuid({
    message: "Creator ID must be a valid UUID.",
  }),
  // Relationships
  users: z.array(z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.email(),
  })).optional(),
  // Dates
  createdAt: z.iso.datetime({
    message: "Invalid date and time format for createdAt.",
  }),
  updatedAt: z.iso.datetime({
    message: "Invalid date and time format for updatedAt.",
  }),
});
export const createClientSchema = clientSchema.pick({
  name: true,
  salary: true,
  companyValue: true,
});
export const updateClientSchema = createClientSchema.partial();

export type Client = z.infer<typeof clientSchema>;
export type CreateClient = z.infer<typeof createClientSchema>;
export type UpdateClient = z.infer<typeof updateClientSchema>;

export class CreateClientDto {
  @ApiProperty({
    description: "Client name.",
    example: "John Doe",
    minLength: 3,
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @ApiProperty({
    description: "Client's salary.",
    example: 5000.5,
    type: Number,
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  @MinLength(1)
  salary!: number;

  @ApiProperty({
    description: "Client's company value.",
    example: 1000000,
    type: Number,
    required: true,
  })
  @IsInt()
  @IsNotEmpty()
  @MinLength(1)
  companyValue!: number;
}
export class UpdateClientDto {
  @ApiProperty({
    description: "Client name.",
    example: "Jane Doe",
    minLength: 3,
    required: false,
  })
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  @ApiPropertyOptional()
  name?: string;

  @ApiProperty({
    description: "Client's salary.",
    example: 7500.0,
    type: Number,
    required: false,
  })
  @IsInt()
  @ApiPropertyOptional()
  @MinLength(1)
  salary?: number;

  @ApiProperty({
    description: "Client's company value.",
    example: 1500000,
    type: Number,
    required: false,
  })
  @IsInt()
  @ApiPropertyOptional()
  @MinLength(1)
  companyValue?: number;
}

// User Schema Definitions
export const userSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
  email: z.email({ message: 'Invalid email format.' }),
  passwordHash: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const userDtoSchema = userSchema.omit({ passwordHash: true });

export const createUserSchema = userSchema
  .omit({
    id: true,
    passwordHash: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long." }),
  });
export const updateUserSchema = createUserSchema
  .omit({ email: true })
  .partial();

export type User = z.infer<typeof userSchema>;
export type UserDto = z.infer<typeof userDtoSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export class CreateUserDto {
  @ApiProperty({
    description: "User's full name.",
    example: "John Doe",
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @ApiProperty({
    description: "User's email address.",
    example: "john.doe@example.com",
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: "User's password (at least 6 characters).",
    example: "Str0ngP@ss!",
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
}
export class UpdateUserDto extends PartialType(CreateUserDto) {}

// Login Schema Definitions
export const loginSchema: z.ZodObject<{
  email: z.ZodEmail;
  password: z.ZodString;
}> = z.object({
  email: z.email({ message: "Invalid email format." }),
  password: z.string().min(1, { message: "Password is required." }),
});
export const loginResponseSchema = z.object({
  accessToken: z.string(),
});
export const jwtPayloadSchema = z.object({
  sub: z.uuid(),
  email: z.email(),
});

export type Login = z.infer<typeof loginSchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;
export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

export class LoginDto {
  @ApiProperty({
    description: "User's email for login.",
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: "User's password.",
    example: 'Str0ngP@ss!',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}

export class LoginResponseDto {
/*   @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }) */
  accessToken!: string;
}
