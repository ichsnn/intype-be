import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OpenAIApi } from 'openai';
import { OpenaiService } from './openai.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  providers: [OpenaiService, OpenAIApi],
  exports: [OpenaiService, OpenAIApi],
})
export class OpenaiModule {}
