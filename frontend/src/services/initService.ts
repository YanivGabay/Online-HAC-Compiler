import { config } from '../config';

export interface CompilerConfig {
  timeout: number;
  maxBuffer: number;
  compilers: string[];
}



export let CONFIG: CompilerConfig = {
  timeout: 5000,  // default
  maxBuffer: 50 * 1024,  // default
  compilers: ['gcc', 'g++']
};

export const STATUS_REQUESTS = 2;


export async function initializeApp() {
  try {
    const response = await fetch(`${config.BACKEND_URL}/config`);
    if (response.ok) {
      CONFIG = await response.json();
    }
  } catch (error) {
    console.warn('Failed to fetch compiler config, using defaults');
  }
} 