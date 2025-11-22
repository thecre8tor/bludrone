import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DroneDeliverySessionEntity, DroneEntity, DroneState } from '../entities';
import { Repository } from 'typeorm';
import { RegisterDroneDto } from '../dto';
import { DatabaseError, NotFoundError, Result, tryCatch } from '../../../core';
import { Drone } from '../models';
import { ResourceNotFoundError } from '../../../core/errors/repository-error';

@Injectable()
export class DroneRepository {
  constructor(
    @InjectRepository(DroneEntity) private readonly droneRepository: Repository<DroneEntity>,
    @InjectRepository(DroneDeliverySessionEntity)
    private readonly droneDeliverySessionRepository: Repository<DroneDeliverySessionEntity>,
  ) {}

  async create(dto: RegisterDroneDto): Promise<Result<Drone, DatabaseError>> {
    const result = await tryCatch(
      async () => {
        const droneEntity = this.droneRepository.create({
          serial_number: dto.serial_number,
          model: dto.model,
          weight_limit: dto.weight_limit,
          battery_capacity: dto.battery_capacity,
          state: DroneState.IDLE,
        });

        const savedEntity = await this.droneRepository.save(droneEntity);
        return Drone.fromEntity(savedEntity);
      },
      (error) => new DatabaseError(`Failed to register drone: ${error}`),
    );

    return result;
  }

  async findBySerialNumber(serialNumber: string): Promise<Result<Drone | null, DatabaseError>> {
    const result = await tryCatch(
      async () => {
        const droneEntity = await this.droneRepository.findOne({
          where: { serial_number: serialNumber },
        });

        if (!droneEntity) {
          return null;
        }

        // const currentWeight = droneEntity.medication
        //   ? droneEntity.medications.reduce((sum, med) => sum + Number(med.weight), 0)
        //   : 0;

        const currentWeight = 0;

        return Drone.fromEntity(droneEntity, currentWeight);
      },
      (error) => new DatabaseError(`Failed to find drone: ${error}`),
    );

    return result;
  }

  async findAll(): Promise<Result<Drone[], DatabaseError>> {
    const result = await tryCatch(
      async () => {
        const droneEntities = await this.droneRepository.find();
        return droneEntities.map(Drone.fromEntity);
      },
      (error) => new DatabaseError(`Failed to find all drones: ${error}`),
    );

    return result;
  }

  async findById(id: string): Promise<Result<Drone, NotFoundError | DatabaseError>> {
    const result = await tryCatch(
      async () => {
        const droneEntity = await this.droneRepository.findOne({
          where: { id },
        });

        if (!droneEntity) {
          throw new ResourceNotFoundError(`Drone with id ${id} not found`);
        }

        const currentWeight = 0;
        return Drone.fromEntity(droneEntity, currentWeight);
      },
      (error) => {
        if (error instanceof ResourceNotFoundError) {
          return new NotFoundError(error.message);
        }

        return new DatabaseError(`Failed to find drone: ${error}`);
      },
    );

    return result;
  }

  async createDeliverySession(droneId: string): Promise<Result<String, DatabaseError>> {
    const result = await tryCatch(
      async () => {
        const deliverySessionEntity = this.droneDeliverySessionRepository.create({
          drone: { id: droneId },
        });

        const savedEntity = await this.droneDeliverySessionRepository.save(deliverySessionEntity);

        return savedEntity.id;
      },
      (error) => new DatabaseError(`Failed to create delivery session: ${error}`),
    );

    return result;
  }

  async updateDroneState(droneId: string, state: DroneState): Promise<Result<void, DatabaseError>> {
    const result = await tryCatch(
      async () => {
        await this.droneRepository.update(droneId, { state });
      },
      (error) => new DatabaseError(`Failed to update drone state: ${error}`),
    );

    return result;
  }
}
