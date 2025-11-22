import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DroneDeliverySessionEntity, DroneEntity, DroneMedicationLoadEntity } from './entities';
import { DroneController } from './controllers';
import { DroneService } from './services';
import { DroneRepository } from './repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([DroneEntity, DroneDeliverySessionEntity, DroneMedicationLoadEntity]),
  ],
  controllers: [DroneController],
  providers: [DroneService, DroneRepository],
  exports: [],
})
export class DroneModule {}
