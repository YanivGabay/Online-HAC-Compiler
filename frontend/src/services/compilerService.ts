import { config } from '../config';

export type CompilerType = 'gcc' | 'g++';

interface CompilationRequest {
  code: string;
  compiler: CompilerType;
  stdin: string;
}

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
  const response = await fetch(`${config.BACKEND_URL}/status/${requestId}`);
  if (!response.ok) {
    throw new Error('Failed to get compilation status');
  }

  const status: CompilationStatus = await response.json();
  return status;
} 