import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DroneEntity, DroneState } from '../entities';
import { Repository } from 'typeorm';
import { RegisterDroneDto } from '../dto';
import { DatabaseError, Result, tryCatch } from '../../../core';
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
}
