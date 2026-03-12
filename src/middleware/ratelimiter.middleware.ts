import rateLimit from "express-rate-limit";

// each ip is limited to 5 requests per minute for llm
export const summarizelimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});