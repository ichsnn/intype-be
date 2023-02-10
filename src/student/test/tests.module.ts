import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpenaiModule } from 'src/openai/openai.module';
import { OpenaiService } from 'src/openai/openai.service';
import { Student } from '../student.entity';
import { ComposeGrammar } from './composegrammar/composegrammar.entity';
import { ComposeGrammarModule } from './composegrammar/composegrammar.module';
import { ListenTyping } from './listentyping/listentyping.entity';
import { ListenTypingModule } from './listentyping/listentyping.module';
import { TestsController } from './tests.controller';
import { Tests } from './tests.entity';
import { TestsService } from './tests.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListenTyping, ComposeGrammar, Student, Tests]),
    ListenTypingModule,
    ComposeGrammarModule,
    OpenaiModule,
  ],
  controllers: [TestsController],
  providers: [TestsService],
  exports: [TestsService, TypeOrmModule],
})
export class TestsModule {}
