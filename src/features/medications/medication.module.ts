import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationEntity } from './entities';
import { MedicationRepository } from './repository';

@Module({
  imports: [TypeOrmModule.forFeature([MedicationEntity])],
  providers: [MedicationRepository],
  exports: [MedicationRepository],
})
export class MedicationModule {}
