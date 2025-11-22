import { MedicationEntity } from '../entities';

export class Medication {
  id: string;
  name: string;
  weight: number;
  code: string;
  image?: string;
  droneId?: string;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(entity: MedicationEntity): Medication {
    const medication = new Medication();
    medication.id = entity.id;
    medication.name = entity.name;
    medication.weight = Number(entity.weight);
    medication.code = entity.code;
    medication.image = entity.image || undefined;
    medication.droneId = entity.drone_id || undefined;
    medication.createdAt = entity.created_at;
    medication.updatedAt = entity.updated_at;
    return medication;
  }
}
