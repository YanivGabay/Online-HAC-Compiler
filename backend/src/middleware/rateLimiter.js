import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      compilationOutput: '⚠️ Rate limit exceeded',
      programOutput: '',
      error: 'Too many requests. Please wait 15 minutes before trying again.'
    });
  }
}); 