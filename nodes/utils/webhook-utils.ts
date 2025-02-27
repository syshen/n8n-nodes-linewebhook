import { IDataObject, INodeInputConfiguration, ConnectionTypes } from 'n8n-workflow';

// Define message and event types as constants
export const MESSAGE_TYPES = ['text', 'audio', 'sticker', 'image', 'video', 'location'];
export const EVENT_TYPES = ['postback', 'join', 'leave', 'memberJoined', 'memberLeft'];
export const ALL_TYPES = [...MESSAGE_TYPES, ...EVENT_TYPES];

// Create a memoized version of the outputs function that only calculates once
export const NODE_OUTPUTS: INodeInputConfiguration[] = [
  ...MESSAGE_TYPES.map((messageType) => ({
    displayName: messageType,
    required: false,
    type: 'main' as ConnectionTypes,
  })),
  ...EVENT_TYPES.map((eventType) => ({
    displayName: eventType,
    required: false,
    type: 'main' as ConnectionTypes,
  }))
];

// Create a lookup map for fast type-to-index resolution
export const TYPE_INDEX_MAP = new Map<string, number>();
ALL_TYPES.forEach((type, index) => {
  TYPE_INDEX_MAP.set(type, index);
});

export function outputs(): INodeInputConfiguration[] {
  return NODE_OUTPUTS;
}

export function indexOfOuputs(type: string): number | null {
  return TYPE_INDEX_MAP.has(type) ? TYPE_INDEX_MAP.get(type) || null : null;
}

/**
 * Process LINE webhook events efficiently with optimized event routing
 * 
 * This function processes an array of LINE events and routes them to the
 * appropriate output based on their type.
 * 
 * @param events - Array of LINE webhook event objects
 * @param destination - The destination from the webhook payload
 * @returns A 2D array of processed events grouped by output type
 */
export function processLineEvents(events: IDataObject[], destination: any): IDataObject[][] {
  // Initialize return data array with empty arrays for each output type
  const returnData: IDataObject[][] = Array(NODE_OUTPUTS.length).fill(null).map(() => []);
  
  // Batch timestamp generation - create once for all events
  const receivedAt = new Date().toISOString();
  
  // Process all events in a single pass with forEach for better performance
  events.forEach(event => {
    const eventType = event['type'] as string;
    
    // Skip invalid events early
    if (\!eventType) {
      return;
    }
    
    let outputIndex: number | null = null;
    
    if (eventType === 'message') {
      // Fast-path validation for message events
      const message = event['message'] as IDataObject | undefined;
      if (\!message || typeof message \!== 'object') {
        return;
      }
      
      const messageType = message['type'] as string;
      if (\!messageType) {
        return;
      }
      
      // Direct map lookup - O(1) operation
      outputIndex = TYPE_INDEX_MAP.get(messageType) ?? null;
    } else {
      // Direct map lookup for non-message events - O(1) operation
      outputIndex = TYPE_INDEX_MAP.get(eventType) ?? null;
    }
    
    // Add to appropriate output bucket if valid type
    if (outputIndex \!== null) {
      returnData[outputIndex].push({
        destination,
        event,
        // Reuse the timestamp for all events in the batch
        receivedAt,
        // Add receipt timestamp for performance metrics if needed
        processedAt: Date.now()
      });
    }
  });
  
  return returnData;
}

/**
 * Generate output data arrays from processed events
 * Uses optimized map operation instead of traditional for loop
 * 
 * @param returnData - The processed event data grouped by type
 * @param helperFunction - The n8n helper function to convert to JSON array
 * @returns The final output data arrays ready for n8n
 */
export function generateOutputData(
  returnData: IDataObject[][],
  helperFunction: (items: IDataObject[]) => any[]
): any[][] {
  // Map returnData to outputData in a single operation
  return returnData.map(data => helperFunction(data));
}
