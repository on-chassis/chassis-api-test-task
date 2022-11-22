import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  create(createQuestionDto: CreateQuestionDto) {
    return this.questionsRepository.save(
      this.questionsRepository.create(createQuestionDto),
    );
  }

  findMany(where: FindOptionsWhere<Question>) {
    return this.questionsRepository.find({
      where,
    });
  }

  findAll() {
    return this.questionsRepository.find();
  }

  findById(id: string) {
    return this.questionsRepository.findOneBy({
      id,
    });
  }

  update(id: string, updateQuestionDto: UpdateQuestionDto) {
    return this.questionsRepository.save(
      this.questionsRepository.create({
        id,
        ...updateQuestionDto,
      }),
    );
  }

  remove(id: string) {
    return this.questionsRepository.delete(id);
  }
}
