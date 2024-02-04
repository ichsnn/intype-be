import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';

@Injectable()
export class OpenaiService {
  constructor(private openai: OpenAI) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async createCompletion(prompt: string) {
    return await this.openai.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'davinci-002',
    });
  }
}
