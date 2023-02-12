import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';

@Injectable()
export class OpenaiService {
  constructor(private openai: OpenAIApi) {
    const config = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(config);
  }

  async createCompletion(prompt: string) {
    return await this.openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      n: 10,
    });
  }
}
