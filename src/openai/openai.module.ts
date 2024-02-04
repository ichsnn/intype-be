import { Module } from '@nestjs/common';
import { OpenAI } from 'openai';
import { OpenaiService } from './openai.service';

@Module({
  imports: [],
  providers: [OpenaiService, OpenAI],
  exports: [OpenaiService, OpenAI],
})
export class OpenaiModule {}
