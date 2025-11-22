import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DroneEntity } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class DroneRepository {
  constructor(
    @InjectRepository(DroneEntity) private readonly droneRepository: Repository<DroneEntity>,
  ) {}
}
