import { 
  LineAuthenticationError, 
  LineValidationError, 
  LineApiError 
} from '../../errors';

describe('LineAuthenticationError', () => {
  it('should create a proper authentication error with default message', () => {
    const mockNode = { name: 'TestNode' };
    const error = new LineAuthenticationError(mockNode);
    
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('LineAuthenticationError');
    expect(error.message).toBe('Authentication failed');
    expect(error.description).toBe('Check your LINE API credentials');
  });

  it('should create a proper authentication error with custom message', () => {
    const mockNode = { name: 'TestNode' };
    const customMessage = 'Custom authentication error message';
    const error = new LineAuthenticationError(mockNode, customMessage);
    
    expect(error.message).toBe(customMessage);
    expect(error.description).toBe('Check your LINE API credentials');
  });
});

describe('LineValidationError', () => {
  it('should create a proper validation error', () => {
    const mockNode = { name: 'TestNode' };
    const message = 'Validation failed';
    const description = 'Check your parameters';
    const error = new LineValidationError(mockNode, message, description);
    
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('LineValidationError');
    expect(error.message).toBe(message);
    expect(error.description).toBe(description);
  });

  it('should create a validation error without description', () => {
    const mockNode = { name: 'TestNode' };
    const message = 'Validation failed';
    const error = new LineValidationError(mockNode, message);
    
    expect(error.message).toBe(message);
    expect(error.description).toBeUndefined();
  });
});

describe('LineApiError', () => {
  it('should create a proper API error with default values', () => {
    const mockNode = { name: 'TestNode' };
    const errorResponse = { status: 500 };
    const error = new LineApiError(mockNode, errorResponse);
    
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('LineApiError');
    expect(error.message).toBe('LINE API error occurred');
    expect(error.description).toBe('Error from LINE API');
  });

  it('should create a proper API error with custom values', () => {
    const mockNode = { name: 'TestNode' };
    const errorResponse = { 
      message: 'API timeout', 
      statusCode: 504 
    };
    const options = {
      description: 'Connection to LINE API timed out',
      itemIndex: 2
    };
    
    const error = new LineApiError(mockNode, errorResponse, options);
    
    expect(error.message).toBe('API timeout');
    expect(error.description).toBe('Connection to LINE API timed out');
    expect(error.itemIndex).toBe(2);
  });
});