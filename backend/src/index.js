import express from 'express';
import cors from 'cors';
import pkg from 'body-parser';
const { json } = pkg;
import fetch from 'node-fetch';
import { config } from './config.js';
import { limiter } from './middleware/rateLimiter.js';
import { compilationManager } from './services/compilationManager.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(json());

app.use('/compile', limiter);

app.post('/compile', async (req, res) => {
  const { code, compiler, stdin } = req.body;

  if (!code || !compiler) {
    return res.status(400).json({ 
      success: false, 
      error: 'Code and compiler are required.' 
    });
  }

  if (!['gcc', 'g++'].includes(compiler)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Unsupported compiler type. Use "gcc" or "g++".' 
    });
  }

  try {
    // Create and queue the compilation request
    const request = compilationManager.createRequest(code, compiler, stdin);
    
    // Return the request ID immediately
    res.json({
      success: true,
      requestId: request.requestId,
      message: 'Compilation request queued'
    });

  } catch (error) {
    console.error('Backend error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Unknown backend error'
    });
  }
});

// Add endpoint to check compilation status
app.get('/status/:requestId', (req, res) => {
  const status = compilationManager.getStatus(req.params.requestId);
  if (!status) {
    return res.status(404).json({
      success: false,
      error: 'Compilation request not found'
    });
  }
  res.json(status);
});

// Add error handling middleware last
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`Backend running on port ${config.PORT}`);
});
