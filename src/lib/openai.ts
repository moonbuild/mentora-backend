import OpenAI from 'openai';

// llm setup
export const groq = new OpenAI({
  apiKey: process.env['GROQ_API_KEY'],
  baseURL: 'https://api.groq.com/openai/v1',
});

export const MODEL_NAME = 'llama-3.3-70b-versatile';
