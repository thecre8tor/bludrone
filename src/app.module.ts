import { Module } from '@nestjs/common';
import { DatabaseModule } from './infrastructure/database';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
