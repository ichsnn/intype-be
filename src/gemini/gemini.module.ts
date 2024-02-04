import { GoogleGenerativeAI } from '@google/generative-ai';
import { Module } from '@nestjs/common';
import { GeminiService } from './gemini.service';

@Module({
  imports: [],
  providers: [GoogleGenerativeAI, GeminiService],
  exports: [GoogleGenerativeAI, GeminiService],
})
export class GeminiModule {}
