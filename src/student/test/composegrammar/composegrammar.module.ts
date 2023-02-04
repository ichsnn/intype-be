import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tests } from '../tests.entity';
import { ComposeGrammar } from './composegrammar.entity';
import { ComposeGrammarService } from './composegrammar.service';

@Module({
  imports: [TypeOrmModule.forFeature([ComposeGrammar, Tests])],
  providers: [ComposeGrammarService],
  exports: [TypeOrmModule, ComposeGrammarService],
})
export class ComposeGrammarModule {}
