import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([MedicationEntity])],
})
export class MedicationModule {}
