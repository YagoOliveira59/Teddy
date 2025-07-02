import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as z from 'zod/v4';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: z.ZodType<any, any, any>) {}

  transform<T = unknown>(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const formattedErrors = result.error.issues.map(
        (err: z.core.$ZodIssue) => ({
          path: err.path.join('.'),
          message: err.message,
        }),
      );

      throw new BadRequestException({
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return result.data as T;
  }
}
