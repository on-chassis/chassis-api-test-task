import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { AuthUser, UserStorage } from 'src/storage/user.storage';
import { DataSource } from 'typeorm';

type EntityBeingValidated = {
  [key: string]: string;
};

export interface EntityCheckNode {
  repository: string;
  property: string;
}

@ValidatorConstraint({ name: 'OwnerValid', async: true })
@Injectable()
export class OwnerValidConstraint implements ValidatorConstraintInterface {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const user: AuthUser = UserStorage.get();

    let valueBeingChecked = value;

    for (const entityRepository of args.constraints as EntityCheckNode[]) {
      const existingEntity = (await this.dataSource
        .getRepository(entityRepository.repository)
        .findOne({
          where: {
            id: valueBeingChecked,
          },
        })) as EntityBeingValidated;

      console.log(user, existingEntity, entityRepository);

      if (!!existingEntity) {
        valueBeingChecked = existingEntity[entityRepository.property];
      } else {
        return false;
      }
    }

    return valueBeingChecked === user?.id;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} entered is not valid`;
  }
}
