import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import fs from 'fs';
import cors from 'cors';
import { config } from './config.js';
import { randomUUID } from 'crypto';

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

const CONFIG = {
  timeout: 5000,        // 5 seconds
  maxBuffer: 50 * 1024  // 50KB
};

// Add new endpoint
app.get('/config', (req, res) => {
  res.json({
    timeout: CONFIG.timeout,
    maxBuffer: CONFIG.maxBuffer,
    compilers: ['gcc', 'g++']
  });
});

app.post('/compile', (req, res) => {
  const { code, compiler, stdin } = req.body;
  const requestId = randomUUID();  // Generate unique ID for this request
  
  const sourceFile = `${requestId}.${compiler === 'gcc' ? 'c' : 'cpp'}`;
  const execFile = `${requestId}.out`;

  try {
    fs.writeFileSync(sourceFile, code);
    
    exec(`${compiler} -Wall ${sourceFile} -o ${execFile}`, (compileErr, _, compileStderr) => {
      if (compileErr) {
        fs.unlinkSync(sourceFile);
        return res.json({
          success: false,
          compilationOutput: compileStderr,
          error: 'Compilation failed'
        });
      }

      const execOptions = {
        timeout: CONFIG.timeout,
        maxBuffer: CONFIG.maxBuffer,
        killSignal: 'SIGTERM'
      };

      const runProcess = exec(`./${execFile}`, execOptions, (runErr, runStdout, runStderr) => {
        // Cleanup our specific files
        fs.unlinkSync(sourceFile);
        fs.unlinkSync(execFile);

        if (runErr && runErr.signal === 'SIGTERM') {
          return res.json({
            success: false,
            compilationOutput: compileStderr || 'Compilation successful',
            programOutput: runStdout ? runStdout.slice(0, 200) + '...' : '',
            error: 'Program execution timed out or exceeded memory limit'  // Updated error message
          });
        }

        if (runErr) {
          return res.json({
            success: false,
            compilationOutput: compileStderr || 'Compilation successful',
            programOutput: runStdout || '',
            error: `Runtime error: ${runStderr}`
          });
        }

        res.json({
          success: true,
          compilationOutput: compileStderr || 'Compilation successful',
          programOutput: runStdout || ''
        });
      });

      if (stdin) {
        runProcess.stdin.write(stdin);
        runProcess.stdin.end();
      }

      // Add output size check
      let outputSize = 0;
      runProcess.stdout.on('data', (data) => {
        outputSize += data.length;
        if (outputSize > execOptions.maxBuffer) {
          runProcess.kill(execOptions.killSignal);
        }
      });
    });
  } catch (error) {
    // Cleanup if error occurs
    if (fs.existsSync(sourceFile)) fs.unlinkSync(sourceFile);
    if (fs.existsSync(execFile)) fs.unlinkSync(execFile);
    // ... error handling ...
  }
});

app.listen(config.PORT, () => {
  console.log(`Compiler service running on port ${config.PORT}`);
});

