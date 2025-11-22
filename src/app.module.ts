import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HealthModule } from './health';
import { AuditModule } from './features/audit/audit.module';
import { MedicationModule } from './features/medications/medication.module';
import { DroneModule } from './features/drones/drone.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    HealthModule,
    DroneModule,
    AuditModule,
    MedicationModule,
  ],
})
export class AppModule {}
