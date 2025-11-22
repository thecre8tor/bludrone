import { DroneEntity, DroneModel, DroneState } from '../entities';

export class Drone {
  id: string;
  serial_number: string;
  model: DroneModel;
  weight_limit: number;
  battery_capacity: number;
  state: DroneState;
  current_weight: number;
  created_at: Date;
  updated_at: Date;

  static fromEntity(entity: DroneEntity, currentWeight: number = 0): Drone {
    const drone = new Drone();
    drone.id = entity.id;
    drone.serial_number = entity.serial_number;
    drone.model = entity.model;
    drone.weight_limit = Number(entity.weight_limit);
    drone.battery_capacity = entity.battery_capacity;
    drone.state = entity.state;
    drone.current_weight = currentWeight;
    drone.created_at = entity.created_at;
    drone.updated_at = entity.updated_at;
    return drone;
  }
}
