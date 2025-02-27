import { NodeApiError, NodeOperationError } from 'n8n-workflow';

export class LineAuthenticationError extends NodeApiError {
  description: string;
  
  constructor(node: any, message: string = 'Authentication failed') {
    super(node, { message });
    this.name = 'LineAuthenticationError';
    this.description = 'Check your LINE API credentials';
  }
}

export class LineValidationError extends NodeOperationError {
  description?: string;
  
  constructor(node: any, message: string, description?: string) {
    super(node, new Error(message));
    this.name = 'LineValidationError';
    this.description = description;
  }
}

export class LineApiError extends NodeApiError {
  description: string;
  itemIndex?: number;
  
  constructor(node: any, errorResponse: any, options?: any) {
    const message = errorResponse?.message || 'LINE API error occurred';
    
    super(node, errorResponse);
    this.name = 'LineApiError';
    this.message = message;
    this.description = options?.description || 'Error from LINE API';
    this.itemIndex = options?.itemIndex;
  }
}