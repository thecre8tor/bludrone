import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DroneDeliverySessionEntity,
  DroneEntity,
  DroneMedicationLoadEntity,
  DroneState,
} from '../entities';
import { IsNull, Repository } from 'typeorm';
import { RegisterDroneDto } from '../dto';
import { DatabaseError, NotFoundError, Result, tryCatch } from '../../../core';
import { Drone } from '../models';
import { ResourceNotFoundError } from '../../../core/errors/repository-error';
import { LoadMedicationDto } from '../dto/load_medication.dto';
import { LoadDroneResponse } from '../payload';

@Injectable()
export class DroneRepository {
  constructor(
    @InjectRepository(DroneEntity) private readonly droneRepository: Repository<DroneEntity>,
    @InjectRepository(DroneDeliverySessionEntity)
    private readonly droneDeliverySessionRepository: Repository<DroneDeliverySessionEntity>,
    @InjectRepository(DroneMedicationLoadEntity)
    private readonly droneMedicationLoadRepository: Repository<DroneMedicationLoadEntity>,
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

  async findAcquiredDroneBySessionId(
    sessionId: string,
  ): Promise<Result<DroneDeliverySessionEntity, NotFoundError | DatabaseError>> {
    const result = await tryCatch(
      async () => {
        const sessionEntity = await this.droneDeliverySessionRepository.findOne({
          where: { id: sessionId, completed_at: IsNull() },
          relations: ['drone'],
        });

        if (!sessionEntity) {
          throw new ResourceNotFoundError(`Session with id ${sessionId} not found`);
        }

        return sessionEntity;
      },
      (error) => {
        if (error instanceof ResourceNotFoundError) {
          return new NotFoundError(error.message);
        }

        return new DatabaseError(`Failed to find acquired drone: ${error}`);
      },
    );

    return result;
  }

  async getTotalLoadedWeight(sessionId: string): Promise<number> {
    const result = await this.droneMedicationLoadRepository
      .createQueryBuilder('load')
      .select('SUM(med.weight * load.quantity)', 'total')
      .leftJoin('load.medication', 'med')
      .where('load.session_id = :sessionId', { sessionId })
      .getRawOne();

    return Number(result?.total || 0);
  }

  async loadMedication(
    dto: LoadMedicationDto,
    droneId: string,
  ): Promise<Result<LoadDroneResponse, DatabaseError>> {
    const result = await tryCatch(
      async () => {
        let fetchLoadedMedications = await this.droneMedicationLoadRepository.findOne({
          where: {
            drone: { id: droneId },
            medication: { id: dto.medication_id },
          },
        });

        if (fetchLoadedMedications) {
          fetchLoadedMedications.quantity += dto.quantity;
        } else {
          fetchLoadedMedications = this.droneMedicationLoadRepository.create({
            session: { id: dto.session_id },
            drone: { id: droneId },
            medication: { id: dto.medication_id },
            quantity: dto.quantity,
          });
        }

        const savedEntity = await this.droneMedicationLoadRepository.save(fetchLoadedMedications);

        return {
          id: savedEntity.id,
          drone_id: savedEntity?.drone?.id,
          medication_id: savedEntity?.medication?.id,
          quantity: savedEntity.quantity,
          loaded_at: savedEntity.loaded_at,
        };
      },
      (error) => new DatabaseError(`Failed to load medication: ${error}`),
    );

    return result;
  }
}
