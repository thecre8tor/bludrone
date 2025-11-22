import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DroneDeliverySessionEntity, DroneEntity, DroneMedicationLoadEntity } from './entities';
import { DroneController, SessionController } from './controllers';
import { DroneService } from './services';
import { DroneRepository } from './repository';
import { MedicationModule } from '../medications/medication.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DroneEntity, DroneDeliverySessionEntity, DroneMedicationLoadEntity]),
    MedicationModule,
  ],
  controllers: [DroneController, SessionController],
  providers: [DroneService, DroneRepository],
  exports: [DroneRepository],
})
export class DroneModule {}
