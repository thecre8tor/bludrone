import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { DroneDeliverySessionEntity } from './drone_delivery_session.entity';
import { DroneEntity } from './drone.entity';
import { MedicationEntity } from '../../medications/entities';

@Entity('drone_medication_loads')
export class DroneMedicationLoadEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Session relationship
  @Index('idx_drone_medication_loads_session_id')
  @ManyToOne(() => DroneDeliverySessionEntity, (session) => session.loads, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: DroneDeliverySessionEntity;

  // Drone relationship
  @ManyToOne(() => DroneEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'drone_id' })
  drone: DroneEntity;

  // Medication relationship
  @ManyToOne(() => MedicationEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'medication_id' })
  medication: MedicationEntity;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'loaded_at',
  })
  loaded_at: Date;
}
