import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class LineMessageNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LineMessageNode',
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
			{
				displayName: 'MessageType',
				name: 'messageType',
				type: 'options',
				options: [
					{
						name: 'Audio',
						value: 'audio',
					},
					{
						name: 'Flex',
						value: 'flex',
					},
					{
						name: 'Image',
						value: 'image',
					},
					{
						name: 'Imagemap',
						value: 'imagemap',
					},
					{
						name: 'Location',
						value: 'location',
					},
					{
						name: 'Sticker',
						value: 'sticker',
					},
					{
						name: 'Template',
						value: 'template',
					},
					{
						name: 'Text',
						value: 'text',
					},
					{
						name: 'Video',
						value: 'video',
					},
				],
				default: 'text',
			},
			{
				displayName: 'ImageUrl',
				name: 'originalContentUrl',
				type: 'string',
				default: '',
				placeholder: '',
				required: true,
				description: 'The image URL',
			},
			{
				displayName: 'PreviewUrl',
				name: 'previewImageUrl',
				type: 'string',
				default: '',
				placeholder: '',
				required: true,
				description: 'Image preview thumbnail URL',
			},
			{
				displayName: 'ReplyToken',
				name: 'replyToken',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'The reply token for reply message',
			},
		],
	};

	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const length = items.length;
		const returnData: INodeExecutionData[] = [];
		for (let i = 0; i < length; i++) {
			const originalContentUrl = this.getNodeParameter('originalContentUrl', i) as string;
			const previewImageUrl = this.getNodeParameter('previewImageUrl', i) as string;
			const replyToken = this.getNodeParameter('replyToken', i) as string;
			returnData.push({
				json: {
					replyToken,
					message: {
						type: 'image',
						originalContentUrl,
						previewImageUrl,
					},
				},
			});
		}
		return this.prepareOutputData(returnData);
	}
}
