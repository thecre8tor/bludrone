import { Drone } from '../models';
import { DroneRepository } from '../repository';
import { RegisterDroneDto } from '../dto';
import { AppError, ConflictError, err, ok, Result } from '../../../core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DroneService {
  constructor(private readonly droneRepository: DroneRepository) {}

  async registerDrone(dto: RegisterDroneDto): Promise<Result<Drone, AppError>> {
    const existingDrone = await this.droneRepository.findBySerialNumber(dto.serial_number);

    if (existingDrone.isOk() && existingDrone.value !== null) {
      return err(new ConflictError(`Drone with serial number ${dto.serial_number} already exists`));
    }

    const result = await this.droneRepository.create(dto);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }

  async getDrones(): Promise<Result<Drone[], AppError>> {
    const result = await this.droneRepository.findAll();

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }
}
