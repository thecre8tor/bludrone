import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DroneDeliverySessionEntity, DroneEntity, DroneMedicationLoadEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([DroneEntity, DroneDeliverySessionEntity, DroneMedicationLoadEntity]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class DroneModule {}
