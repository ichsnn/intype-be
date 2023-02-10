import { Configuration, OpenAIApi } from 'openai';

const config = new Configuration({
  apiKey: process.env.API_KEY_OPENAI,
});

export const openai = new OpenAIApi(config);
