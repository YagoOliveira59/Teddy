"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseDto = exports.LoginDto = exports.jwtPayloadSchema = exports.loginResponseSchema = exports.loginSchema = exports.UpdateUserDto = exports.CreateUserDto = exports.updateUserSchema = exports.createUserSchema = exports.userDtoSchema = exports.userSchema = exports.UpdateClientDto = exports.CreateClientDto = exports.updateClientSchema = exports.createClientSchema = exports.clientSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const z = __importStar(require("zod/v4"));
// Client Schema Definitions
exports.clientSchema = z.object({
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
exports.createClientSchema = exports.clientSchema.pick({
    name: true,
    salary: true,
    companyValue: true,
});
exports.updateClientSchema = exports.createClientSchema.partial();
class CreateClientDto {
    name;
    salary;
    companyValue;
}
exports.CreateClientDto = CreateClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Client name.",
        example: "John Doe",
        minLength: 3,
        required: true,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateClientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Client's salary.",
        example: 5000.5,
        type: Number,
        required: true,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", Number)
], CreateClientDto.prototype, "salary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Client's company value.",
        example: 1000000,
        type: Number,
        required: true,
    }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", Number)
], CreateClientDto.prototype, "companyValue", void 0);
class UpdateClientDto {
    name;
    salary;
    companyValue;
}
exports.UpdateClientDto = UpdateClientDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Client name.",
        example: "Jane Doe",
        minLength: 3,
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], UpdateClientDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Client's salary.",
        example: 7500.0,
        type: Number,
        required: false,
    }),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", Number)
], UpdateClientDto.prototype, "salary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "Client's company value.",
        example: 1500000,
        type: Number,
        required: false,
    }),
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", Number)
], UpdateClientDto.prototype, "companyValue", void 0);
// User Schema Definitions
exports.userSchema = z.object({
    id: z.uuid(),
    name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
    email: z.email({ message: 'Invalid email format.' }),
    passwordHash: z.string(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
});
exports.userDtoSchema = exports.userSchema.omit({ passwordHash: true });
exports.createUserSchema = exports.userSchema
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
exports.updateUserSchema = exports.createUserSchema
    .omit({ email: true })
    .partial();
class CreateUserDto {
    name;
    email;
    password;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User's full name.",
        example: "John Doe",
        minLength: 3,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User's email address.",
        example: "john.doe@example.com",
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User's password (at least 6 characters).",
        example: "Str0ngP@ss!",
        minLength: 6,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
class UpdateUserDto extends (0, swagger_1.PartialType)(CreateUserDto) {
}
exports.UpdateUserDto = UpdateUserDto;
// Login Schema Definitions
exports.loginSchema = z.object({
    email: z.email({ message: "Invalid email format." }),
    password: z.string().min(1, { message: "Password is required." }),
});
exports.loginResponseSchema = z.object({
    accessToken: z.string(),
});
exports.jwtPayloadSchema = z.object({
    sub: z.uuid(),
    email: z.email(),
});
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User's email for login.",
        example: 'john.doe@example.com',
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "User's password.",
        example: 'Str0ngP@ss!',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class LoginResponseDto {
    /*   @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }) */
    accessToken;
}
exports.LoginResponseDto = LoginResponseDto;
