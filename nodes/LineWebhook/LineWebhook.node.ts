import {
	IDataObject,
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	ICredentialDataDecryptedObject,
	INodeInputConfiguration,
	INodeExecutionData,
	ConnectionTypes,
} from 'n8n-workflow';
import {
	defaultWebhookDescription,
} from './description';
import { LineAuthenticationError, LineValidationError } from '../errors';
import { 
  outputs, 
  indexOfOuputs, 
  NODE_OUTPUTS, 
  TYPE_INDEX_MAP, 
  processLineEvents 
} from '../utils/webhook-utils';
import crypto from 'crypto';


function s2b(str: string, encoding: BufferEncoding): Buffer {
  return Buffer.from(str, encoding);
}

function safeCompare(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

/**
 * Validates the Line webhook signature using an optimized approach
 * 
 * @param body - The raw body of the webhook request
 * @param channelSecret - The Line channel secret for HMAC validation
 * @param signature - The signature from X-Line-Signature header
 * @returns true if signature is valid, otherwise false
 */
function validateSignature(
  body: string | Buffer,
  channelSecret: string,
  signature: string,
): boolean {
  // Create HMAC once with proper buffer handling
  const hmac = crypto.createHmac("SHA256", channelSecret);
  
  // Use buffer directly when possible to avoid encoding/decoding overhead
  if (Buffer.isBuffer(body)) {
    hmac.update(body);
  } else {
    hmac.update(body.toString('utf8'));
  }
  
  const digest = hmac.digest();
  
  // One-time base64 decode of signature to buffer
  const signatureBuffer = s2b(signature, "base64");
  
  // Use timing-safe comparison to prevent timing attacks
  return safeCompare(digest, signatureBuffer);
}

export class LineWebhook implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Line Webhook',
		name: 'LineWebhook',
		icon: 'file:line.svg',
		group: ['trigger'],
		version: 1,
		description: 'Line Webhook',
		defaults: {
			name: 'LineWebhook',
		},
		inputs: ['main'],
		outputs: outputs(),
		webhooks: [defaultWebhookDescription],
		credentials: [
			{
				name: 'lineWebhookAuthApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '',
				placeholder: 'line-webhook',
				required: true,
				description: 'The path to listen to'
			}
		],
	};

	// The execute method will go here
	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const headerName = 'x-line-signature';
		const headers = this.getHeaderData();
		const req = this.getRequestObject();
		const body = req.rawBody;

		try {
			// Credentials validation
			let credentials;
			try {
				credentials = await this.getCredentials('lineWebhookAuthApi') as {
					channel_secret: string
				};
				
				if (!credentials?.channel_secret) {
					throw new LineAuthenticationError(
						this.getNode(),
						'LINE channel secret is missing'
					);
				}
			} catch (error) {
				if (error.name === 'LineAuthenticationError') {
					throw error;
				}
				throw new LineAuthenticationError(
					this.getNode(),
					'Failed to load LINE webhook credentials'
				);
			}

			// Signature validation
			if (!headers.hasOwnProperty(headerName)) {
				throw new LineValidationError(
					this.getNode(),
					'Missing signature header',
					'The x-line-signature header is required for LINE webhook validation'
				);
			}
			
			const signature = (headers as IDataObject)[headerName] as string;
			if (!validateSignature(body, credentials.channel_secret, signature)) {
				throw new LineAuthenticationError(
					this.getNode(),
					'Invalid webhook signature'
				);
			}
			
			// Webhook data validation
			const bodyObject = this.getBodyData();
			if (!bodyObject['events'] || !Array.isArray(bodyObject['events'])) {
				throw new LineValidationError(
					this.getNode(),
					'Invalid webhook data format',
					'The webhook payload must contain an events array'
				);
			}
			
			// Process webhook data
			// Initialize return data array with empty arrays for each output type
			const returnData: IDataObject[][] = Array(NODE_OUTPUTS.length).fill(null).map(() => []);

			const destination = bodyObject['destination'];
			const events = bodyObject['events'] as Array<IDataObject>;
			
			try {
				for (const event of events) {
					const eventType = (event['type'] as string);
					
					if (!eventType) {
						continue; // Skip events without a type
					}
					
					if (eventType === 'message') {
						if (!event['message'] || typeof event['message'] !== 'object') {
							continue; // Skip invalid message events
						}
						
						const messageType = (event['message'] as IDataObject)['type'] as string;
						if (!messageType) {
							continue; // Skip messages without a type
						}
						
						const outputIndex = indexOfOuputs(messageType);
						if (outputIndex !== null) {
							returnData[outputIndex].push({
								destination,
								event,
								receivedAt: new Date().toISOString(),
							});
						}
					} else {
						const outputIndex = indexOfOuputs(eventType);
						if (outputIndex !== null) {
							returnData[outputIndex].push({
								destination,
								event,
								receivedAt: new Date().toISOString(),
							});
						}
					}
				}
			} catch (error) {
				throw new LineValidationError(
					this.getNode(),
					`Failed to process webhook events: ${error.message}`,
					'Error occurred while processing the webhook payload'
				);
			}

			const outputData: INodeExecutionData[][] = [];
			for (let idx = 0; idx < returnData.length; idx++) {
				outputData.push(this.helpers.returnJsonArray(returnData[idx]));
			}

			return {
				workflowData: outputData,
			};
			
		} catch (error) {
			const resp = this.getResponseObject();
			
			if (error.name === 'LineAuthenticationError') {
				resp.writeHead(401, { 'WWW-Authenticate': 'Basic realm="LINE Webhook"' });
			} else if (error.name === 'LineValidationError') {
				resp.writeHead(400);
			} else {
				resp.writeHead(500);
			}
			
			resp.end(error.message || 'Webhook error');
			return { noWebhookResponse: true };
		}
	}
}
