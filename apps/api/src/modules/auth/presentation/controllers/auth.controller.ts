import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as z from 'zod/v4';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import type { LoginResponse, User as UserEntity } from '@teddy/types';
import { loginSchema } from '@teddy/types';
import { LoginUseCase } from '../../application/use-cases/login/login.use-case';
import { User } from '../decorators/user.decorator';
import { ApiSecure } from 'src/common/decorators/api-secure.decorator';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Public } from '../decorators/public.decorator';

export class AuthPayloadClass {
  id: string;
  email: string;
}

class LoginDto {
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
class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token to be used in subsequent requests.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;
}

@ApiTags('Auth')
@ApiSecure()
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'Authenticate user and get a token' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  login(
    @Body(new ZodValidationPipe(loginSchema as z.ZodType<any, any, any>))
    @User()
    user: UserEntity,
  ): Promise<LoginResponse> {
    return this.loginUseCase.execute(user.email);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, type: AuthPayloadClass })
  getProfile(
    @User() user: Omit<UserEntity, 'passwordHash' | 'createdAt' | 'updatedAt'>,
  ) {
    return user;
  }
}
