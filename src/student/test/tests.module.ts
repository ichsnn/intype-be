import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenaiModule } from 'src/openai/openai.module';
import { Student } from '../student.entity';
import { TestsController } from './tests.controller';
import { Tests } from './tests.entity';
import { TestsService } from './tests.service';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Tests]), OpenaiModule],
  controllers: [TestsController],
  providers: [TestsService],
  exports: [TestsService, TypeOrmModule],
})
export class TestsModule {}
