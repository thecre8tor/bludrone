import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { DroneDeliverySessionEntity } from './drone_delivery_session.entity';
import { BatteryAuditEntity } from '../../audit/entities';

export enum DroneModel {
  LIGHTWEIGHT = 'Lightweight',
  MIDDLEWEIGHT = 'Middleweight',
  CRUISERWEIGHT = 'Cruiserweight',
  HEAVYWEIGHT = 'Heavyweight',
}

export enum DroneState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  DELIVERING = 'DELIVERING',
  DELIVERED = 'DELIVERED',
  RETURNING = 'RETURNING',
}

@Entity('drones')
export class DroneEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  serial_number: string;

  @Column({
    type: 'enum',
    enum: DroneModel,
  })
  model: DroneModel;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight_limit: number; // in grams, max 500

  @Column({ type: 'int' })
  battery_capacity: number; // percentage 0-100

  @Column({
    type: 'enum',
    enum: DroneState,
    default: DroneState.IDLE,
  })
  state: DroneState;

  @OneToMany(() => DroneDeliverySessionEntity, (session) => session.drone)
  delivery_sessions: DroneDeliverySessionEntity[];

  @OneToMany(() => BatteryAuditEntity, (audit) => audit.drone)
  battery_audits: BatteryAuditEntity[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
