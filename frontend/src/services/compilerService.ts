import { config } from '../config';
import { CONFIG } from './initService';

export type CompilerType = 'gcc' | 'g++';

interface CompilationResponse {
  success: boolean;
  requestId?: string;
  message?: string;
  error?: string;
}

export interface CompilationStatus {
  requestId: string;
  status: 'queued' | 'compiling' | 'completed' | 'failed';
  result?: {
    success: boolean;
    compilationOutput: string;
    programOutput?: string;
    error?: string;
  }
}

export async function compileAndRun(code: string, compiler: CompilerType, stdin: string): Promise<CompilationStatus> {
  try {
    // First send compilation request
    const response = await fetch(`${config.BACKEND_URL}/compile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, compiler, stdin }),
    });

    if (!response.ok) {
      throw new Error('Compilation request failed');
    }

    const initialResponse: CompilationResponse = await response.json();
    if (!initialResponse.success || !initialResponse.requestId) {
      throw new Error(initialResponse.error || 'Failed to start compilation');
    }

    // Get single status update
    const status = await getCompilationStatus(initialResponse.requestId);
    return status;

  } catch (error) {
    throw error;
  }
}

async function getCompilationStatus(requestId: string): Promise<CompilationStatus> {
  // First check
  await new Promise(resolve => setTimeout(resolve, 500));
  let status = await checkStatus(requestId);
  
  // If still compiling, wait up to timeout
  const startTime = Date.now();
  while (status.status === 'compiling' && Date.now() - startTime < CONFIG.timeout) {
    await new Promise(resolve => setTimeout(resolve, 500));
    status = await checkStatus(requestId);
  }
  
  return status;
}

async function checkStatus(requestId: string) {
  const response = await fetch(`${config.BACKEND_URL}/status/${requestId}`);
  if (!response.ok) {
    throw new Error('Failed to get compilation status');
  }
  return await response.json();
} 