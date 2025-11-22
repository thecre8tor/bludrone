import { Body, Controller, Get, Post } from '@nestjs/common';
import { RegisterDroneDto } from '../dto';
import { Drone } from '../models';
import { DroneService } from '../services';
import { AppError } from '../../../core';
import { ApiResponseBuilder, ApiResponse } from '../../../core/responses/api-response';

@Controller('drones')
export class DroneController {
  constructor(private readonly droneService: DroneService) {}

  @Post()
  async registerDrone(@Body() dto: RegisterDroneDto): Promise<ApiResponse<Drone>> {
    const result = await this.droneService.registerDrone(dto);

    if (result.isOk()) {
      return ApiResponseBuilder.success('Drone registered successfully', result.value);
    } else {
      // Convert AppError to HTTP exception
      const error = result.error as AppError;
      throw error.toHttpException();
    }
  }

  @Get()
  async getDrones(): Promise<ApiResponse<Drone[]>> {
    const result = await this.droneService.getDrones();

    if (result.isOk()) {
      return ApiResponseBuilder.success('Drones fetched successfully', result.value);
    } else {
      const error = result.error as AppError;
      throw error.toHttpException();
    }
  }
}
