import { Module } from '@nestjs/common';
import { OpenAIApi } from 'openai';
import { OpenaiService } from './openai.service';

@Module({
  imports: [],
  providers: [OpenaiService, OpenAIApi],
  exports: [OpenaiService, OpenAIApi],
})
export class OpenaiModule {}
