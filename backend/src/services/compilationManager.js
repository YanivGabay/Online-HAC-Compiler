import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

class CompilationManager {
  constructor() {
    this.activeCompilations = new Map();
    this.compilationQueue = [];
    this.maxConcurrent = 5;
    this.workDir = path.join(process.cwd(), 'temp');
    this.runningCompilations = new Set(); // Track currently running compilations
    
    if (!fs.existsSync(this.workDir)) {
      fs.mkdirSync(this.workDir);
    }

    // Clean temp directory on startup
    this.cleanTempDirectory();
  }

  cleanTempDirectory() {
    if (fs.existsSync(this.workDir)) {
      fs.readdirSync(this.workDir).forEach(file => {
        fs.unlinkSync(path.join(this.workDir, file));
      });
    }
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

    // Add to queue and try to process
    this.compilationQueue.push(request);
    this.processQueue();
    
    return request;
  }

  async processQueue() {
    // Calculate how many new compilations we can start
    const running = this.runningCompilations.size;
    const available = this.maxConcurrent - running;
    
    if (available <= 0) {
      console.log(`At max capacity (${this.maxConcurrent}). ${this.compilationQueue.length} requests waiting.`);
      return;
    }

    // Start as many compilations as we can
    for (let i = 0; i < available && this.compilationQueue.length > 0; i++) {
      const request = this.compilationQueue.shift();
      if (!request) break;

      // Start compilation without awaiting it
      this.runningCompilations.add(request.requestId);
      this.startCompilation(request)
        .finally(() => {
          this.runningCompilations.delete(request.requestId);
          // Try to process more from queue when this one finishes
          this.processQueue();
        });
    }
  }

  async startCompilation(request) {
    try {
      this.activeCompilations.set(request.requestId, {
        ...this.activeCompilations.get(request.requestId),
        status: 'compiling'
      });

      const result = await this.compileAndRun(request);

      this.activeCompilations.set(request.requestId, {
        ...this.activeCompilations.get(request.requestId),
        status: 'completed',
        endTime: Date.now(),
        result  // Store the compilation result
      });

    } catch (error) {
      this.activeCompilations.set(request.requestId, {
        ...this.activeCompilations.get(request.requestId),
        status: 'failed',
        endTime: Date.now(),
        error: error.message
      });
    }
  }

  async compileAndRun(request) {
    const { sourceFile, execFile } = this.getFilenames(request.requestId, request.compiler);
    
    try {
      // Write source file
      fs.writeFileSync(sourceFile, request.code);
      
      // Execute compilation and run
      const compileResult = await this.executeCompilation(request.compiler, sourceFile, execFile);
      if (!compileResult.success) {
        return compileResult;
      }

      // Run the compiled program
      const runResult = await this.executeProgram(execFile, request.stdin);
      return runResult;
      
    } finally {
      // Clean up files immediately after compilation
      this.cleanupFiles(request.requestId);
    }
  }

  async executeCompilation(compiler, sourceFile, execFile) {
    return new Promise((resolve) => {
      exec(`${compiler} -Wall ${sourceFile} -o ${execFile}`, (error, stdout, stderr) => {
        if (error) {
          resolve({
            success: false,
            compilationOutput: stderr,
            error: 'Compilation failed'
          });
          return;
        }
        resolve({
          success: true,
          compilationOutput: stderr || 'Compilation successful'
        });
      });
    });
  }

  async executeProgram(execFile, stdin) {
    return new Promise((resolve, reject) => {
      const execOptions = {
        timeout: 5000,
        maxBuffer: 50 * 1024 // 50KB output limit
      };

      const process = exec(execFile, execOptions);
      let output = '';
      let errorOutput = '';

      process.stdout.on('data', (data) => {
        output += data;
        if (output.length > execOptions.maxBuffer) {
          process.kill();
        }
      });

      process.stderr.on('data', (data) => {
        errorOutput += data;
      });

      if (stdin) {
        process.stdin.write(stdin);
        process.stdin.end();
      }

      process.on('exit', (code, signal) => {
        if (signal === 'SIGTERM') {
          resolve({
            success: false,
            compilationOutput: 'Program terminated',
            programOutput: output.slice(0, 200) + '...',
            error: 'Program exceeded time or memory limit'
          });
          return;
        }

        resolve({
          success: code === 0,
          compilationOutput: 'Program executed',
          programOutput: output,
          error: code !== 0 ? errorOutput : undefined
        });
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  cleanupFiles(requestId) {
    // Clean up the specific files for this request
    const { sourceFile, execFile } = this.getFilenames(requestId);
    if (fs.existsSync(sourceFile)) fs.unlinkSync(sourceFile);
    if (fs.existsSync(execFile)) fs.unlinkSync(execFile);
  }

  scheduleStatusCleanup(requestId) {
    // Remove from active compilations after some time
    setTimeout(() => {
      this.activeCompilations.delete(requestId);
    }, 5 * 60 * 1000); // Keep status for 5 minutes
  }

  getActiveCount() {
    return this.runningCompilations.size;
  }

  getStatus(requestId) {
    return this.activeCompilations.get(requestId);
  }

  // Generate unique filenames instead of directories
  getFilenames(requestId, compiler) {
    const extension = compiler === 'gcc' ? '.c' : '.cpp';
    return {
      sourceFile: path.join(this.workDir, `${requestId}${extension}`),
      execFile: path.join(this.workDir, `${requestId}.out`)
    };
  }
}

export const compilationManager = new CompilationManager(); 