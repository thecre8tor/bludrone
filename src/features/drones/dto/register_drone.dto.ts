import { IsString, IsEnum, IsNumber, Min, Max, MaxLength, Matches } from 'class-validator';
import { DroneModel } from '../entities/drone.entity';

export class RegisterDroneDto {
  @IsString()
  @MaxLength(100, { message: 'Serial number must be at most 100 characters' })
  serial_number: string;

  @IsEnum(DroneModel, {
    message: 'Model must be one of: Lightweight, Middleweight, Cruiserweight, Heavyweight',
  })
  model: DroneModel;

  @IsNumber()
  @Min(0, { message: 'Weight limit must be positive' })
  @Max(500, { message: 'Weight limit cannot exceed 500 grams' })
  weight_limit: number;

  @IsNumber()
  @Min(0, { message: 'Battery capacity must be between 0 and 100' })
  @Max(100, { message: 'Battery capacity must be between 0 and 100' })
  battery_capacity: number;
}
