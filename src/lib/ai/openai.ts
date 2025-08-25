import OpenAI from 'openai';

export const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error('OPENAI_API_KEY is missing');
  return new OpenAI({ apiKey });
};

export const getModel = () => process.env.OPENAI_MODEL || 'gpt-4o-mini';

export const defaultChatOptions = {
  temperature: 0.4,
  response_format: { type: 'json_object' as const }
};