import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { TemplateSeedingService } from './template-seeding.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TemplateController],
  providers: [TemplateService, TemplateSeedingService],
  exports: [TemplateService],
})
export class TemplatesModule {}
