import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { messageTypes } from './LineMessageNodeDescription';
import { LineValidationError } from '../errors';

export class LineMessageNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Line Message',
		name: 'LineMessageNode',
		icon: 'file:line.svg',
		group: ['transform'],
		version: 1,
		description: 'Line Message Node',
		defaults: {
			name: 'LineMessageNode',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [],
		properties: [
			...messageTypes
		],
	};

	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const length = items.length;
		const returnData: INodeExecutionData[] = [];
		
		for (let i = 0; i < length; i++) {
			try {
				const messageType = this.getNodeParameter('operation', i) as string;
				let message = null;
				
				try {
					if (messageType === 'text') {
						const text = this.getNodeParameter('text', i) as string;
						message = {
							type: 'text',
							text
						};
					} else if (messageType === 'image') {
						const originalContentUrl = this.getNodeParameter('originalContentUrl', i) as string;
						const previewImageUrl = this.getNodeParameter('previewImageUrl', i) as string;
						message = {
							type: 'image',
							originalContentUrl,
							previewImageUrl,
						};
					} else if (messageType === 'video') {
						const originalContentUrl = this.getNodeParameter('originalContentUrl', i) as string;
						const previewImageUrl = this.getNodeParameter('previewImageUrl', i) as string;
						message = {
							type: 'video',
							originalContentUrl,
							previewImageUrl,
						};
					} else if (messageType === 'audio') {
						const originalContentUrl = this.getNodeParameter('originalContentUrl', i) as string;
						const duration = this.getNodeParameter('duration', i) as number;
						message = {
							type: 'audio',
							originalContentUrl,
							duration,
						};
					} else if (messageType === 'location') {
						const title = this.getNodeParameter('title', i) as string;
						const address = this.getNodeParameter('address', i) as string;
						const latitude = this.getNodeParameter('latitude', i) as number;
						const longitude = this.getNodeParameter('longitude', i) as number;
						message = {
							type: 'location',
							title,
							address,
							latitude,
							longitude
						};
					} else if (messageType === 'flex') {
						const altText = this.getNodeParameter('altText', i) as string;
						const flexContent = this.getNodeParameter('flexContent', i) as string;
						
						try {
							message = {
								type: 'flex',
								altText,
								contents: JSON.parse(flexContent)
							};
						} catch (error) {
							throw new LineValidationError(
								this.getNode(),
								'Invalid JSON format for flex content',
								'Please check that your flex content is valid JSON'
							);
						}
					} else if (messageType === 'sticker') {
						const packageId = this.getNodeParameter('packageId', i) as string;
						const stickerId = this.getNodeParameter('stickerId', i) as string;
						const quoteToken = this.getNodeParameter('quoteToken', i) as string;
						message = {
							type: 'sticker',
							packageId,
							stickerId,
							quoteToken
						};
					} else {
						throw new LineValidationError(
							this.getNode(),
							`Unsupported message type: ${messageType}`,
							'Please select a valid message type'
						);
					}
				} catch (error) {
					if (error.name === 'LineValidationError') {
						throw error;
					}
					
					throw new LineValidationError(
						this.getNode(),
						`Failed to process ${messageType} message parameters`,
						error.message
					);
				}

				returnData.push({
					json: {
						message
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							errorDescription: error.description,
							item: i,
						}
					});
					continue;
				}
				throw error;
			}
		}
		
		return this.prepareOutputData(returnData);
	}
}
