import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: parseInt(process.env.AI_RATE_LIMIT_PER_HOUR || '20', 10),
  message: 'AI request limit exceeded. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
