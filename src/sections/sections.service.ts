import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { Section } from './entities/section.entity';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,
  ) {}

  create(createSectionDto: CreateSectionDto) {
    return this.sectionsRepository.save(
      this.sectionsRepository.create(createSectionDto),
    );
  }

  findMany(where: FindOptionsWhere<Section>) {
    return this.sectionsRepository.find({
      where,
    });
  }

  findAll() {
    return this.sectionsRepository.find();
  }

  findById(id: string) {
    return this.sectionsRepository.findOneBy({
      id,
    });
  }

  update(id: string, updateSectionDto: UpdateSectionDto) {
    return this.sectionsRepository.save(
      this.sectionsRepository.create({
        id,
        ...updateSectionDto,
      }),
    );
  }

  remove(id: string) {
    return this.sectionsRepository.delete(id);
  }
}
