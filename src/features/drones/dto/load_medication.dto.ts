import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class LoadMedicationDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  session_id: string;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  medication_id: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}
