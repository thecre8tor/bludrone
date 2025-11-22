import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
