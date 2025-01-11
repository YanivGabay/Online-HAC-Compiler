// Similar logic: in development we use localhost,
// in production we use the Docker service name (since backend and compiler are in the same Docker network)
export const config = {
  PORT: 3001,
  COMPILER_URL: 'http://compiler:3002'  // Always use the service name in Docker
}; 