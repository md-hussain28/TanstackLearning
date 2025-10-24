


export const errors = [
  { status: 400, message: 'Bad Request', probability: 0.4 },
  { status: 401, message: 'Unauthorized', probability: 0.25 },
  { status: 403, message: 'Forbidden', probability: 0.15 },
  { status: 404, message: 'Not Found', probability: 0.1 },
  { status: 409, message: 'Conflict', probability: 0.05 },
  { status: 422, message: 'Unprocessable Entity', probability: 0.1 },
  { status: 429, message: 'Too Many Requests', probability: 0.05 },
  { status: 500, message: 'Internal Server Error', probability: 0.1 },
  { status: 502, message: 'Bad Gateway', probability: 0.03 },
  { status: 503, message: 'Service Unavailable', probability: 0.02 },
];

// Enhanced error scenarios with more realistic patterns
export const errorScenarios = {
  networkTimeout: { status: 408, message: 'Request Timeout', probability: 0.08 },
  rateLimit: { status: 429, message: 'Rate limit exceeded. Try again later.', probability: 0.05 },
  validationError: { status: 422, message: 'Validation failed', probability: 0.12 },
  databaseError: { status: 500, message: 'Database connection failed', probability: 0.06 },
  authError: { status: 401, message: 'Authentication required', probability: 0.08 },
  permissionError: { status: 403, message: 'Insufficient permissions', probability: 0.04 },
  notFound: { status: 404, message: 'Resource not found', probability: 0.1 },
  conflict: { status: 409, message: 'Resource already exists', probability: 0.03 },
  serverOverload: { status: 503, message: 'Server is temporarily unavailable', probability: 0.02 },
};

// Utility to get random int between min and max (inclusive)
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Enhanced delay helper with different patterns
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Realistic latency simulation based on operation type
export function getRealisticDelay(operation: 'read' | 'write' | 'delete' | 'search'): number {
  const baseDelays = {
    read: { min: 200, max: 800 },
    write: { min: 500, max: 1500 },
    delete: { min: 300, max: 1000 },
    search: { min: 400, max: 1200 }
  };
  
  const { min, max } = baseDelays[operation];
  return randomInt(min, max);
}

// Simulate network issues (occasional longer delays)
export function getNetworkDelay(operation: 'read' | 'write' | 'delete' | 'search'): number {
  const baseDelay = getRealisticDelay(operation);
  
  // 10% chance of network issues causing longer delays
  if (Math.random() < 0.1) {
    return baseDelay + randomInt(1000, 3000);
  }
  
  // 5% chance of very slow response
  if (Math.random() < 0.05) {
    return baseDelay + randomInt(2000, 5000);
  }
  
  return baseDelay;
}

// Enhanced error probability based on operation
export function getErrorProbability(operation: 'read' | 'write' | 'delete' | 'search'): number {
  const probabilities = {
    read: 0.15,    // Lower chance for read operations
    write: 0.25,   // Higher chance for write operations
    delete: 0.20,  // Medium chance for delete operations
    search: 0.18   // Medium chance for search operations
  };
  
  return probabilities[operation];
}

// Get random error based on operation type
export function getRandomError(operation: 'read' | 'write' | 'delete' | 'search') {
  const errorProbability = getErrorProbability(operation);
  
  if (Math.random() < errorProbability) {
    // Use specific error scenarios for different operations
    const operationErrors = {
      read: ['notFound', 'authError', 'permissionError', 'serverOverload'],
      write: ['validationError', 'conflict', 'databaseError', 'rateLimit'],
      delete: ['notFound', 'permissionError', 'conflict'],
      search: ['rateLimit', 'serverOverload', 'networkTimeout']
    };
    
    const availableErrors = operationErrors[operation];
    const randomErrorType = availableErrors[randomInt(0, availableErrors.length - 1)];
    
    return errorScenarios[randomErrorType as keyof typeof errorScenarios];
  }
  
  return null;
}

// Simulate partial failures (some data missing)
export function simulatePartialFailure(): boolean {
  return Math.random() < 0.05; // 5% chance of partial failure
}

// Simulate data corruption
export function simulateDataCorruption(): boolean {
  return Math.random() < 0.02; // 2% chance of data corruption
}
