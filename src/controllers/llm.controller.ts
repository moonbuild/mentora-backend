import { Request, Response } from 'express';
import { groq, MODEL_NAME } from '../lib/openai';

const llmController = {
  summarizeText: async (req: Request, res: Response) => {
    const { text } = req.body;

    // validation of text
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text is missing or empty.' });
    }
    if (text.length < 50) {
      return res.status(400).json({ error: 'Text is too short. Please provide at least 50 characters.' });
    }
    if (text.length > 9000) {
      return res.status(413).json({ error: 'text too large. Maximum 9,000 characters allowed.' });
    }

    try {
      const completion = await groq.chat.completions.create({
        model: MODEL_NAME,
        messages: [
          {
            role: 'system',
            content: `
              You are a concise summarization expert. 
              Always return a summary as a single paragraph of maximum 120 words.
              Be consistent with this format every time.
            `,
          },
          { 
            role: 'user', 
            content: `Summarize the following text: ${text}` 
          },
        ],
      });

      // we get response in this nested format
      const summary = completion.choices[0]?.message?.content?.trim();

      if (!summary) {
        throw new Error('LLM returned an empty response');
      }

      return res.status(200).json({
        summary,
        model: MODEL_NAME
      });
    } catch (error: any) {
      console.error('Summarization Error:', error);

      // if Groq/LLM provider returns an error 
      if (error.status) {
        return res.status(502).json({ 
          error: 'The summarization service is temporarily unavailable' 
        });
      }

      return res.status(500).json({ 
        error: 'An internal error occurred while processing the request' 
      });
    }
  },
};

export default llmController;