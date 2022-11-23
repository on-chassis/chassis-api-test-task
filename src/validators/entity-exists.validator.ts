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

@ValidatorConstraint({ name: 'EntityExists', async: true })
@Injectable()
export class EntityExistsConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const entityRepository = args.constraints[0] as string;

    const existingEntity = (await this.dataSource
      .getRepository(entityRepository)
      .findOne({
        where: {
          id: value,
        },
      })) as EntityBeingValidated;

    return !!existingEntity;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} entered is not valid`;
  }
}
