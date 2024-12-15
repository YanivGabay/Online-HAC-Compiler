export type CompilerType = 'gcc' | 'g++';

interface CompilationRequest {
  code: string;
  compiler: CompilerType;
  stdin: string;
}

interface CompilationResult {
  success: boolean;
  compilationOutput: string;
  programOutput?: string;
  error?: string;
}

export async function compileAndRun(code: string, compiler: CompilerType, stdin: string): Promise<CompilationResult> {
  try {
    const requestData: CompilationRequest = {
      code,
      compiler,
      stdin,
    };

    const response = await fetch('your-backend-url/compile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error('Compilation request failed');
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      compilationOutput: 'Error connecting to server',
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
} 