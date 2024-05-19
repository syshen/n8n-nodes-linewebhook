import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { messageTypes } from './LineMessageNodeDescription';

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
			const messageType = this.getNodeParameter('operation', i) as string;
			let message = null;
			if (messageType === 'text') {
				const text = this.getNodeParameter('text', i) as string;
				message = {
					type: 'text',
					text
				}
			} else if (messageType === 'image') {
				const originalContentUrl = this.getNodeParameter('originalContentUrl', i) as string;
				const previewImageUrl = this.getNodeParameter('previewImageUrl', i) as string;
				message = {
					type: 'image',
					originalContentUrl,
					previewImageUrl,
				}
			} else if (messageType === 'video') {
				const originalContentUrl = this.getNodeParameter('originalContentUrl', i) as string;
				const previewImageUrl = this.getNodeParameter('previewImageUrl', i) as string;
				message = {
					type: 'video',
					originalContentUrl,
					previewImageUrl,
				}
			} else if (messageType === 'audio') {
				const originalContentUrl = this.getNodeParameter('originalContentUrl', i) as string;
				const duration = this.getNodeParameter('duration', i) as number;
				message = {
					type: 'video',
					originalContentUrl,
					duration,
				}
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
				}
			} else if (messageType === 'flex') {
				const altText = this.getNodeParameter('altText', i) as string;
				const flexContent = this.getNodeParameter('flexContent', i) as string;
				message = {
					type: 'flex',
					altText,
					contents: JSON.parse(flexContent)
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
				}
			}

			returnData.push({
				json: {
					message
				},
			});
		}
		return this.prepareOutputData(returnData);
	}
}
