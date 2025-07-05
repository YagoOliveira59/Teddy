import { Controller, Get } from '@nestjs/common';
import { Public } from '@modules/auth/presentation/decorators/public.decorator';

@Controller()
export class MetricsController {
  @Public()
  @Get('/metrics')
  getMetrics() {
    return '';
  }
}
