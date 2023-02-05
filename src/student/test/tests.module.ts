import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../student.entity';
import { ComposeGrammar } from './composegrammar/composegrammar.entity';
import { ComposeGrammarModule } from './composegrammar/composegrammar.module';
import { ListenTyping } from './listentyping/listentyping.entity';
import { ListenTypingModule } from './listentyping/listentyping.module';
import { TestsController } from './tests.controller';
import { Tests } from './tests.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListenTyping, ComposeGrammar, Student, Tests]),
    ListenTypingModule,
    ComposeGrammarModule,
  ],
  controllers: [TestsController],
  providers: [],
})
export class TestsModule {}