import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('medications')
export class MedicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string; // allowed only letters, numbers, '-', '_'

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  weight: number; // in grams

  @Column({ type: 'varchar', length: 100, unique: true })
  code: string; // allowed only upper case letters, underscore and numbers

  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
