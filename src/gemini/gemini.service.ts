import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GeminiService {
  constructor(private gemini: GoogleGenerativeAI) {
    this.gemini = new GoogleGenerativeAI(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    );
  }

  async createCompletion(prompt: string) {
    const model = this.gemini.getGenerativeModel({
      model: 'gemini-pro',
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  }
}
