import { Drone } from '../models';
import { DroneRepository } from '../repository';
import { RegisterDroneDto } from '../dto';
import {
  AppError,
  BadRequestError,
  ConflictError,
  err,
  NotFoundError,
  ok,
  Result,
} from '../../../core';
import { Injectable } from '@nestjs/common';
import { DroneMedicationLoadEntity, DroneState } from '../entities';
import { LoadMedicationDto } from '../dto/load_medication.dto';
import { MedicationRepository } from '../../medications/repository';
import { LoadDroneResponse, LoadedMedicationsResponse } from '../payload';

@Injectable()
export class DroneService {
  constructor(
    private readonly droneRepository: DroneRepository,
    private readonly medicationRepository: MedicationRepository,
  ) {}

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

  async loadMedication(dto: LoadMedicationDto): Promise<Result<LoadDroneResponse, AppError>> {
    const sessionResult = await this.droneRepository.findAcquiredDroneBySessionId(dto.session_id);

    if (sessionResult.isErr()) {
      return err(sessionResult.error);
    }

    const session = sessionResult.value;
    const drone = session.drone;

    if (drone.battery_capacity < 25) {
      return err(new BadRequestError('Drone battery too low (<25%). Cannot load medication.'));
    }

    if (!['LOADING'].includes(drone.state)) {
      return err(new BadRequestError(`Cannot load medication. Drone is currently ${drone.state}.`));
    }

    const medicationResult = await this.medicationRepository.findById(dto.medication_id);

    // TODO: Handle database errors properly
    if (medicationResult.isErr()) {
      return err(new NotFoundError(medicationResult.error.message));
    }

    const medication = medicationResult.value;

    const currentWeight = await this.droneRepository.getTotalLoadedWeight(dto.session_id);
    const additionalWeight = medication.weight * dto.quantity;

    if (currentWeight + additionalWeight > drone.weight_limit) {
      return err(
        new BadRequestError(
          `Loading exceeds drone weight limit. Current=${currentWeight}, Attempt=${additionalWeight}, Limit=${drone.weight_limit}`,
        ),
      );
    }

    const result = await this.droneRepository.loadMedication(dto, drone.id);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }

  async getLoadedMedications(droneId: string): Promise<Result<LoadedMedicationsResponse, AppError>> {
    const result = await this.droneRepository.getLoadedMedications(droneId);

    if (result.isErr()) {
      return err(result.error);
    }

    return ok(result.value);
  }
}
