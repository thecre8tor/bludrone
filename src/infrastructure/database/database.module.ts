import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  DroneEntity,
  DroneDeliverySessionEntity,
  DroneMedicationLoadEntity,
} from '../../features/drones/entities';
import { MedicationEntity } from '../../features/medications/entities';
import { BatteryAuditEntity } from '../../features/audit/entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST', '127.0.0.1'),
        port: configService.get<number>('DATABASE_PORT', 5433),
        username: configService.get<string>('DATABASE_USER', 'bluser'),
        password: configService.get<string>('DATABASE_PASSWORD', 'secret'),
        database: configService.get('DATABASE_NAME', 'bludrone'),
        entities: [
          DroneEntity,
          DroneDeliverySessionEntity,
          DroneMedicationLoadEntity,
          MedicationEntity,
          BatteryAuditEntity,
        ],
        synchronize: false, // Don't auto-sync in production
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
