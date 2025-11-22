import { Controller, Get } from '@nestjs/common';
import { ApiResponseBuilder } from '../core/responses/api-response';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return ApiResponseBuilder.success('Service is healthy', {
      timestamp: new Date().toISOString(),
    });
  }
}
