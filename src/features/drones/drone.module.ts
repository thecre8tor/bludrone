import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DroneEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([DroneEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class DroneModule {}
