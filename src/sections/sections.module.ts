import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OwnerValidConstraint } from 'src/validators/owner-valid.validator';

import { Section } from './entities/section.entity';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';

@Module({
  imports: [TypeOrmModule.forFeature([Section])],
  controllers: [SectionsController],
  providers: [SectionsService, OwnerValidConstraint],
  exports: [SectionsService],
})
export class SectionsModule {}
