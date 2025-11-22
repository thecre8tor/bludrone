import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { DroneMedicationLoadEntity } from './drone_medical_load.entity';
import { DroneEntity } from './drone.entity';

@Entity('drone_delivery_sessions')
export class DroneDeliverySessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_drone_delivery_sessions_drone_id')
  @ManyToOne(() => DroneEntity, (drone) => drone.delivery_sessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'drone_id' })
  drone: DroneEntity;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @Column({
    type: 'timestamptz',
    name: 'completed_at',
    nullable: true,
  })
  completed_at: Date | null;

  @OneToMany(() => DroneMedicationLoadEntity, (load) => load.session)
  loads: DroneMedicationLoadEntity[];
}
