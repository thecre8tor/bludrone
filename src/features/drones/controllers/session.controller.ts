import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiResponseBuilder } from '../../../core/responses/api-response';
import { DroneService } from '../services';
import { LoadMedicationDto } from '../dto/load_medication.dto';
import { AppError } from '../../../core';
import { LoadDroneResponse } from '../payload';

@Controller('sessions')
export class SessionController {
  constructor(private readonly droneService: DroneService) {}

  @Post(':id/load-medication')
  async loadMedication(
    @Param('id') id: string,
    @Body() dto: LoadMedicationDto,
  ): Promise<ApiResponse<LoadDroneResponse>> {
    const result = await this.droneService.loadMedication(dto);

    if (result.isOk()) {
      return ApiResponseBuilder.success('Medication loaded successfully', result.value);
    } else {
      const error = result.error as AppError;
      throw error.toHttpException();
    }
  }
}
