import { Controller, Get, Param } from '@nestjs/common';
import { ApiResponse } from '../../../core/responses/api-response';
import { DroneService } from '../services';

@Controller('sessions')
export class SessionController {
  constructor(private readonly droneService: DroneService) {}
}
