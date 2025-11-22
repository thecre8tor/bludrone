import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatteryAuditEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([BatteryAuditEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class AuditModule {}
