import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { DroneEntity } from '../../drones/entities';

@Entity('battery_audit')
export class BatteryAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_battery_audit_drone_id')
  @ManyToOne(() => DroneEntity, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'drone_id' })
  drone: DroneEntity;

  @Index('idx_battery_audit_serial_number')
  @Column({ type: 'varchar', length: 100, nullable: false })
  serial_number: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  battery_capacity: number; // percentage 0-100

  @Index('idx_battery_audit_created_at', { synchronize: false }) // DESC index created in SQL
  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
    nullable: false,
  })
  created_at: Date;
}
