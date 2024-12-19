import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import fs from 'fs';
import cors from 'cors';
import { config } from './config.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MEMORY_LIMIT = 50 * 1024; // Reduce to 50KB for stricter limit

const cleanup = (filename) => {
  try {
    // Remove the source file
    if (fs.existsSync(filename)) {
      fs.unlinkSync(filename);
    }
    // Remove the compiled program
    if (fs.existsSync('program')) {
      fs.unlinkSync('program');
    }
  } catch (err) {
    console.error('Cleanup error:', err);
  }
};

app.post('/compile', (req, res) => {
  const { code, compiler, stdin } = req.body;
  if (!code || !compiler) {
    return res.status(400).json({ success: false, error: 'Code and compiler are required' });
  }

  if (!['gcc', 'g++'].includes(compiler)) {
    return res.status(400).json({ success: false, error: 'Unsupported compiler type' });
  }

  const filename = compiler === 'gcc' ? 'program.c' : 'program.cpp';
  fs.writeFileSync(filename, code);

  // First compile the program
  exec(`${compiler} -Wall ${filename} -o program`, (compileErr, _, compileStderr) => {
    if (compileErr) {
      cleanup(filename);
      return res.json({
        success: false,
        compilationOutput: compileStderr,
        error: 'Compilation failed'
      });
    }

    const execOptions = {
      timeout: 5000,
      maxBuffer: MEMORY_LIMIT,
      killSignal: 'SIGTERM'
    };

    let outputBuffer = '';
    let errorBuffer = '';
    const runProcess = exec(`./program`, execOptions);
    
    // Collect stdout
    runProcess.stdout.on('data', (data) => {
      outputBuffer += data;
      if (outputBuffer.length > MEMORY_LIMIT) {
        runProcess.kill('SIGTERM');
      }
    });

    // Collect stderr
    runProcess.stderr.on('data', (data) => {
      errorBuffer += data;
    });

    // Handle process completion
    runProcess.on('exit', (code, signal) => {
      cleanup(filename);
      
      // Case 1: Memory Limit Exceeded
      if (outputBuffer.length > MEMORY_LIMIT) {
        return res.json({
          success: false,
          compilationOutput: '⚠️ Program terminated - Memory limit exceeded',
          programOutput: `${outputBuffer.slice(0, 200)}...\n\n⛔ Program stopped: Output exceeded the 50KB limit`,
          error: 'Your program generated too much output (>50KB). Try reducing the amount of output.'
        });
      }

      // Case 2: Time Limit Exceeded
      if (signal === 'SIGTERM') {
        return res.json({
          success: false,
          compilationOutput: '⚠️ Program terminated - Time limit exceeded',
          programOutput: `${outputBuffer}\n\n⛔ Program stopped: Exceeded the 5-second time limit`,
          error: 'Your program took too long to execute (>5 seconds). Check for infinite loops or optimize your code.'
        });
      }

      // Case 3: Runtime Error
      if (code !== 0) {
        return res.json({
          success: false,
          compilationOutput: '⚠️ Program terminated - Runtime error occurred',
          programOutput: outputBuffer,
          error: errorBuffer || 'Program crashed or exited with an error. Check for segmentation faults, array out of bounds, etc.'
        });
      }

      // Case 4: Successful Execution
      res.json({
        success: true,
        compilationOutput: '✅ Program compiled and executed successfully',
        programOutput: outputBuffer || '(Program executed successfully but produced no output)'
      });
    });

    // Handle stdin if provided
    if (stdin) {
      runProcess.stdin.write(stdin);
      runProcess.stdin.end();
    }
  });
});

app.listen(config.PORT, () => {
  console.log(`Compiler service running on port ${config.PORT}`);
});

