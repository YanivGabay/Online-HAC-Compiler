import express from 'express';
import bodyParser from 'body-parser';
import { exec } from 'child_process';
import fs from 'fs';
import cors from 'cors';
import { config } from './config.js';

const app = express();
app.use(cors());
app.use(bodyParser.json());

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
      return res.json({
        success: false,
        compilationOutput: compileStderr,
        error: 'Compilation failed'
      });
    }

    const runProcess = exec(`./program`, { timeout: 5000 }, (runErr, runStdout, runStderr) => {
      if (runErr) {
        if (runErr.signal === 'SIGTERM') {
          return res.json({
            success: false,
            compilationOutput: compileStderr || 'No compilation errors',
            error: 'Program timed out'
          });
        }
        return res.json({
          success: true,
          compilationOutput: compileStderr || 'No compilation errors',
          programOutput: runStdout || '',
          error: `Runtime error: ${runStderr}`
        });
      }

      res.json({
        success: true,
        compilationOutput: compileStderr || 'No compilation errors',
        programOutput: runStdout
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
