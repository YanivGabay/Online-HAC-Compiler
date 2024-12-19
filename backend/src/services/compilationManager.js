import { randomUUID } from 'crypto';
import fetch from 'node-fetch';
import { config } from '../config.js';

class CompilationManager {
  constructor() {
    this.activeCompilations = new Map();
    this.compilationQueue = [];
    this.maxConcurrent = 5;
    this.runningCompilations = new Set();
  }

  createRequest(code, compiler, stdin) {
    const requestId = randomUUID();
    const request = {
      requestId,
      timestamp: Date.now(),
      code,
      compiler,
      stdin
    };
    
    this.activeCompilations.set(requestId, {
      requestId,
      status: 'queued',
      startTime: Date.now()
    });

    this.compilationQueue.push(request);
    this.processQueue();
    
    return request;
  }

  async processQueue() {
    const running = this.runningCompilations.size;
    const available = this.maxConcurrent - running;
    
    if (available <= 0) {
      console.log(`At max capacity (${this.maxConcurrent}). ${this.compilationQueue.length} requests waiting.`);
      return;
    }

    for (let i = 0; i < available && this.compilationQueue.length > 0; i++) {
      const request = this.compilationQueue.shift();
      if (!request) break;

      this.runningCompilations.add(request.requestId);
      this.startCompilation(request)
        .finally(() => {
          this.runningCompilations.delete(request.requestId);
          this.processQueue();
        });
    }
  }

  async startCompilation(request) {
    try {
      console.log('Starting compilation:', request.requestId);
      
      this.activeCompilations.set(request.requestId, {
        ...this.activeCompilations.get(request.requestId),
        status: 'compiling'
      });

      const response = await fetch(`${config.COMPILER_URL}/compile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: request.code,
          compiler: request.compiler,
          stdin: request.stdin
        })
      });

      console.log('Compiler response status:', response.status);

      if (!response.ok) {
        throw new Error('Compiler service error');
      }

      const result = await response.json();
      console.log('Compiler result:', result);

      this.activeCompilations.set(request.requestId, {
        ...this.activeCompilations.get(request.requestId),
        status: 'completed',
        endTime: Date.now(),
        result
      });

    } catch (error) {
      console.error('Compilation error:', error);
      this.activeCompilations.set(request.requestId, {
        ...this.activeCompilations.get(request.requestId),
        status: 'failed',
        endTime: Date.now(),
        error: error.message
      });
    }
  }

  getStatus(requestId) {
    return this.activeCompilations.get(requestId);
  }
}

export const compilationManager = new CompilationManager(); 