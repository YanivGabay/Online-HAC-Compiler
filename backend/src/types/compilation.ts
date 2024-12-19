interface CompilationRequest {
  requestId: string;
  timestamp: number;
  code: string;
  compiler: string;
  stdin?: string;
}

interface CompilationResult {
  success: boolean;
  compilationOutput: string;
  programOutput?: string;
  error?: string;
}

interface CompilationStatus {
  requestId: string;
  status: 'queued' | 'compiling' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
  result?: CompilationResult;
  error?: string;
} 