import { NodeApiError, NodeOperationError } from 'n8n-workflow';

export class LineAuthenticationError extends NodeApiError {
  constructor(node: any, message: string = 'Authentication failed') {
    super(node, { message }, { 
      message,
      statusCode: 401,
      description: 'Check your LINE API credentials'
    });
  }
}

export class LineValidationError extends NodeOperationError {
  constructor(node: any, message: string, description?: string) {
    super(node, new Error(message), { description });
  }
}

export class LineApiError extends NodeApiError {
  constructor(node: any, errorResponse: any, options?: any) {
    const message = errorResponse?.message || 'LINE API error occurred';
    const statusCode = errorResponse?.statusCode || 500;
    
    super(node, errorResponse, {
      message,
      statusCode,
      description: options?.description || 'Error from LINE API',
      itemIndex: options?.itemIndex
    });
  }
}