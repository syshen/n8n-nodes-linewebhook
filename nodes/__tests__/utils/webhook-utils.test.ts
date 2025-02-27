import { IDataObject } from 'n8n-workflow';
import {
  MESSAGE_TYPES,
  EVENT_TYPES,
  NODE_OUTPUTS,
  TYPE_INDEX_MAP,
  outputs,
  indexOfOuputs,
  processLineEvents,
  generateOutputData
} from '../../utils/webhook-utils';

describe('Webhook Utils Constants', () => {
  it('should define correct message types', () => {
    expect(MESSAGE_TYPES).toEqual(['text', 'audio', 'sticker', 'image', 'video', 'location']);
  });

  it('should define correct event types', () => {
    expect(EVENT_TYPES).toEqual(['postback', 'join', 'leave', 'memberJoined', 'memberLeft']);
  });

  it('should create node outputs for all types', () => {
    expect(NODE_OUTPUTS.length).toBe(MESSAGE_TYPES.length + EVENT_TYPES.length);
    
    // Check if all message types are included
    MESSAGE_TYPES.forEach(type => {
      expect(NODE_OUTPUTS.some(output => output.displayName === type)).toBeTruthy();
    });
    
    // Check if all event types are included
    EVENT_TYPES.forEach(type => {
      expect(NODE_OUTPUTS.some(output => output.displayName === type)).toBeTruthy();
    });
  });

  it('should correctly map types to indices', () => {
    // Each type should have a corresponding index in the map
    const allTypes = [...MESSAGE_TYPES, ...EVENT_TYPES];
    expect(TYPE_INDEX_MAP.size).toBe(allTypes.length);
    
    // Each type should map to a unique index
    const indices = new Set();
    TYPE_INDEX_MAP.forEach((index) => {
      expect(indices.has(index)).toBeFalsy();
      indices.add(index);
    });
    
    // Check specific mappings
    expect(TYPE_INDEX_MAP.get('text')).toBe(0);
    expect(TYPE_INDEX_MAP.get('postback')).toBeDefined();
  });
});

describe('outputs function', () => {
  it('should return NODE_OUTPUTS', () => {
    expect(outputs()).toBe(NODE_OUTPUTS);
  });
});

describe('indexOfOuputs function', () => {
  it('should return correct index for valid types', () => {
    expect(indexOfOuputs('text')).toBe(0);
    expect(indexOfOuputs('audio')).toBe(1);
    // Check last message type
    expect(indexOfOuputs('location')).toBe(MESSAGE_TYPES.length - 1);
    // Check first event type
    expect(indexOfOuputs('postback')).toBe(MESSAGE_TYPES.length);
  });

  it('should return null for invalid types', () => {
    expect(indexOfOuputs('nonexistent')).toBeNull();
    expect(indexOfOuputs('')).toBeNull();
  });
});

describe('processLineEvents function', () => {
  it('should correctly process valid events', () => {
    const destination = 'test-destination';
    const events: IDataObject[] = [
      {
        type: 'message',
        message: { type: 'text', text: 'Hello' },
        timestamp: 1234567890,
        source: { type: 'user', userId: 'user1' }
      },
      {
        type: 'postback',
        postback: { data: 'action=buy&itemId=123' },
        timestamp: 1234567890,
        source: { type: 'user', userId: 'user1' }
      }
    ];
    
    const result = processLineEvents(events, destination);
    
    // Should have arrays for all types
    expect(result.length).toBe(NODE_OUTPUTS.length);
    
    // Text message should be in the first bucket (index 0)
    expect(result[0].length).toBe(1);
    expect(result[0][0].event).toBe(events[0]);
    expect(result[0][0].destination).toBe(destination);
    expect(result[0][0].receivedAt).toBeDefined();
    
    // Postback event should be in its bucket
    const postbackIndex = TYPE_INDEX_MAP.get('postback')!;
    expect(result[postbackIndex].length).toBe(1);
    expect(result[postbackIndex][0].event).toBe(events[1]);
  });

  it('should handle invalid events gracefully', () => {
    const events: IDataObject[] = [
      { type: 'unknown' },
      { type: 'message' }, // Missing message property
      { type: 'message', message: {} }, // Missing message type
      { type: 'message', message: { type: 'unknown' } } // Unknown message type
    ];
    
    const result = processLineEvents(events, 'destination');
    
    // Should have arrays for all types
    expect(result.length).toBe(NODE_OUTPUTS.length);
    
    // No valid events, so all buckets should be empty
    result.forEach(bucket => {
      expect(bucket.length).toBe(0);
    });
  });

  it('should add timestamp and processing info', () => {
    const event: IDataObject = {
      type: 'message',
      message: { type: 'text', text: 'Hello' }
    };
    
    const result = processLineEvents([event], 'destination');
    const textBucket = result[0];
    
    expect(textBucket.length).toBe(1);
    expect(textBucket[0].receivedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/); // ISO date format
    expect(typeof textBucket[0].processedAt).toBe('number');
  });
});

describe('generateOutputData function', () => {
  it('should map return data using provided helper function', () => {
    const returnData: IDataObject[][] = [
      [{ id: 1 }, { id: 2 }],
      [{ id: 3 }],
      []
    ];
    
    const mockHelperFunction = jest.fn((items) => {
      return items.map((item: IDataObject) => ({ ...item, processed: true }));
    });
    
    const result = generateOutputData(returnData, mockHelperFunction);
    
    expect(result.length).toBe(returnData.length);
    expect(mockHelperFunction).toHaveBeenCalledTimes(returnData.length);
    
    // First bucket: two items processed
    expect(result[0].length).toBe(2);
    expect(result[0][0]).toEqual({ id: 1, processed: true });
    expect(result[0][1]).toEqual({ id: 2, processed: true });
    
    // Second bucket: one item processed
    expect(result[1].length).toBe(1);
    expect(result[1][0]).toEqual({ id: 3, processed: true });
    
    // Third bucket: empty
    expect(result[2].length).toBe(0);
  });
});