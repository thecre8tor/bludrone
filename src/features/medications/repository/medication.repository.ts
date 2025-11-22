import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicationEntity } from '../entities';
import { Repository } from 'typeorm';
import { Result, tryCatch } from '../../../core/result';
import { DatabaseError, ResourceNotFoundError } from '../../../core/errors/repository-error';
import { NotFoundError } from '../../../core/errors/app-error';

@Injectable()
export class MedicationRepository {
  constructor(
    @InjectRepository(MedicationEntity)
    private readonly medicationRepository: Repository<MedicationEntity>,
  ) {}

  async findById(id: string): Promise<Result<MedicationEntity, NotFoundError | DatabaseError>> {
    const result = await tryCatch(
      async () => {
        const medicationEntity = await this.medicationRepository.findOne({
          where: { id },
        });

        if (!medicationEntity) {
          throw new ResourceNotFoundError(`Medication with id ${id} not found`);
        }

        return medicationEntity;
      },
      (error) => {
        if (error instanceof ResourceNotFoundError) {
          return new NotFoundError(error.message);
        }

        return new DatabaseError(`Failed to find medication: ${error}`);
      },
    );

    return result;
  }
}
