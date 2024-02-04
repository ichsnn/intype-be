import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenaiModule } from 'src/openai/openai.module';
import { GeminiModule } from 'src/gemini/gemini.module';
import { Student } from '../student.entity';
import { TestsController } from './tests.controller';
import { Tests } from './tests.entity';
import { TestsService } from './tests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Student, Tests]),
    OpenaiModule,
    GeminiModule,
  ],
  controllers: [TestsController],
  providers: [TestsService],
  exports: [TestsService, TypeOrmModule],
})
export class TestsModule {}
