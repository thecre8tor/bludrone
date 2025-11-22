import { Medication } from '../../medications/models';

export interface LoadedMedicationItem {
  id: string;
  medication: Medication;
  quantity: number;
  loaded_at: Date;
}

export interface LoadedMedicationsResponse {
  drone_id: string;
  medications: LoadedMedicationItem[];
}

