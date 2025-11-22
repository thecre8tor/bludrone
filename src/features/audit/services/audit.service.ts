import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BatteryAuditEntity } from '../entities';
import { DroneRepository } from '../../drones/repository';
import { DatabaseError, Result, tryCatch } from '../../../core';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(BatteryAuditEntity)
    private readonly auditRepository: Repository<BatteryAuditEntity>,
    private readonly droneRepository: DroneRepository,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async checkBatteryLevels(): Promise<void> {
    console.log('Running battery level audit...');

    const dronesResult = await this.droneRepository.findAllForAudit();

    if (dronesResult.isErr()) {
      console.error('Failed to fetch drones for audit:', dronesResult.error);
      return;
    }

    const drones = dronesResult.value;
    const auditPromises = drones.map((drone) =>
      this.createAuditLog(drone.id, drone.serial_number, drone.battery_capacity),
    );

    await Promise.all(auditPromises);
    console.log(`Battery audit completed for ${drones.length} drones`);
  }

  async createAuditLog(
    droneId: string,
    serialNumber: string,
    batteryCapacity: number,
  ): Promise<Result<BatteryAuditEntity, DatabaseError>> {
    const result = await tryCatch(
      async () => {
        const auditEntity = this.auditRepository.create({
          drone: { id: droneId },
          serial_number: serialNumber,
          battery_capacity: batteryCapacity,
        });

        return await this.auditRepository.save(auditEntity);
      },
      (error) => new DatabaseError(`Failed to create audit log: ${error}`),
    );

    return result;
  }

  async getAuditHistory(droneId: string): Promise<Result<BatteryAuditEntity[], DatabaseError>> {
    const result = await tryCatch(
      async () => {
        return await this.auditRepository.find({
          where: { drone: { id: droneId } },
          order: { created_at: 'DESC' },
          take: 100, // Limit to last 100 entries
        });
      },
      (error) => new DatabaseError(`Failed to fetch audit history: ${error}`),
    );

    return result;
  }
}
