import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TemplateSeedingService } from './template-seeding.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [TemplateSeedingService],
  exports: [],
})
export class TemplatesModule { }
