import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import fs from 'fs';
import cors from 'cors';
import { config } from './config.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MEMORY_LIMIT = 1024 * 1024; // 1MB output limit

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
      maxBuffer: MEMORY_LIMIT
    };

    const runProcess = exec(`./program`, execOptions, (runErr, runStdout, runStderr) => {
      // Always cleanup after execution
      cleanup(filename);

      // Check for memory limit exceeded
      if (runErr && runErr.code === 'ENOBUFS') {
        return res.json({
          success: false,
          compilationOutput: compileStderr || 'Compilation successful',
          programOutput: 'Program output exceeded 1MB limit',
          error: 'Memory Limit Exceeded (MLE) - Output was too large'
        });
      }

      // Check for timeout
      if (runErr && runErr.signal === 'SIGTERM') {
        return res.json({
          success: false,
          compilationOutput: compileStderr || 'Compilation successful',
          programOutput: 'Program execution timed out after 5 seconds',
          error: 'Time Limit Exceeded (TLE) - Program took too long to execute'
        });
      }

      // Check for other runtime errors
      if (runErr) {
        return res.json({
          success: false,
          compilationOutput: compileStderr || 'Compilation successful',
          programOutput: runStdout || '',
          error: `Runtime error: ${runStderr}`
        });
      }

      // Successful execution
      res.json({
        success: true,
        compilationOutput: compileStderr || 'Compilation successful',
        programOutput: runStdout || 'Program executed successfully (no output)'
      });
    });

    if (stdin) {
      runProcess.stdin.write(stdin);
      runProcess.stdin.end();
    }
  });
});

app.listen(config.PORT, () => {
  console.log(`Compiler service running on port ${config.PORT}`);
});
