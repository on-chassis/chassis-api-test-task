import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { DataSource } from 'typeorm';

type EntityBeingValidated = {
  id: string;
};

@ValidatorConstraint({ name: 'Unique', async: true })
@Injectable()
export class UniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const entityValue = args.object as EntityBeingValidated;
    const entityRepository = args.constraints[0] as string;

    const existingEntity = (await this.dataSource
      .getRepository(entityRepository)
      .findOne({
        where: {
          [args.property]: value,
        },
      })) as EntityBeingValidated;

    if (!existingEntity || existingEntity.id === entityValue?.id) {
      return true;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} entered is not valid`;
  }
}
