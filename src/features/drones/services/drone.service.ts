import { Drone } from '../models';
import { DroneRepository } from '../repository';
import { RegisterDroneDto } from '../dto';
import { AppError, BadRequestError, ConflictError, err, ok, Result } from '../../../core';
import { Injectable } from '@nestjs/common';
import { DroneState } from '../entities';

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

  async acquireDrone(droneId: string): Promise<Result<String, AppError>> {
    const droneResult = await this.droneRepository.findById(droneId);

    if (droneResult.isErr()) {
      return err(droneResult.error);
    }

    const drone = droneResult.value;

    if (drone.state !== DroneState.IDLE) {
      return err(
        new BadRequestError(`Cannot start new loading session. Drone is currently ${drone.state}.`),
      );
    }

    if (drone.battery_capacity < 25) {
      return err(new BadRequestError(`Drone battery too low (<25%). Cannot start loading.`));
    }

    const sessionResult = await this.droneRepository.createDeliverySession(droneId);

    if (sessionResult.isErr()) {
      return err(sessionResult.error);
    }

    const sessionId = sessionResult.value;

    drone.state = DroneState.LOADING;
    const updateResult = await this.droneRepository.updateDroneState(droneId, DroneState.LOADING);

    if (updateResult.isErr()) {
      return err(updateResult.error);
    }

    return ok(sessionId);
  }
}
