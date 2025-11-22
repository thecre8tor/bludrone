import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatteryAuditEntity } from './entities';
import { AuditService } from './services';
import { DroneModule } from '../drones/drone.module';

@Module({
  imports: [TypeOrmModule.forFeature([BatteryAuditEntity]), DroneModule],
  providers: [AuditService],
  exports: [],
})
export class AuditModule {}
