import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DroneEntity, DroneState } from '../entities';
import { Repository } from 'typeorm';
import { RegisterDroneDto } from '../dto';
import { DatabaseError, Result, tryCatch } from '@/core';
import { Drone } from '../models';

@Injectable()
export class DroneRepository {
  constructor(
    @InjectRepository(DroneEntity) private readonly droneRepository: Repository<DroneEntity>,
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
}
