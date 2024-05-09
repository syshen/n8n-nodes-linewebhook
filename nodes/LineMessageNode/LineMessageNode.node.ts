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
				displayName: "Text",
				name: "text",
				type: "string",
				default: "",
				placeholder: "",
				description: "The text message you want to send to user",
				displayOptions: {
					show: {
						messageType: ['text'],
					},
				}
			},
			{
				displayName: 'URL',
				name: 'originalContentUrl',
				type: 'string',
				default: '',
				placeholder: '',
				required: true,
				description: 'The URL for image, video, or audio file (Max character limit: 2000)',
				displayOptions: {
					show: {
						messageType: ['image', 'audio', 'video'],
					},
				},
			},
			{
				displayName: 'Preview Url',
				name: 'previewImageUrl',
				type: 'string',
				default: '',
				placeholder: '',
				required: true,
				description: 'Preview image URL (Max character limit: 2000)',
				displayOptions: {
					show: {
						messageType: ['image', 'video'],
					},
				},
			},
			{
				displayName: 'Tracking ID',
				name: 'trackingId',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'ID used to identify the video when Video viewing complete event occurs. If you send a video message with trackingId added, the video viewing complete event occurs when the user finishes watching the video.',
				displayOptions: {
					show: {
						messageType: ['audio', 'video'],
					},
				},
			},
			{
				displayName: "Duration",
				name: "duration",
				type: "number",
				default: 0,
				placeholder: "",
				required: true,
				description: "Audio duration",
				displayOptions: {
					show: {
						messageType: ['audio'],
					},
				}
			},
			{
				displayName: "Title",
				name: "title",
				type: "string",
				default: "",
				placeholder: "",
				required: true,
				description: "Location title, max character limit: 100",
				displayOptions: {
					show: {
						messageType: ['location'],
					},
				}
			},
			{
				displayName: "Address",
				name: "address",
				type: "string",
				default: "",
				placeholder: "",
				required: true,
				description: "Location address, max character limit: 100",
				displayOptions: {
					show: {
						messageType: ['location'],
					},
				}
			},
			{
				displayName: "Latitude",
				name: "latitude",
				type: "number",
				default: 0,
				placeholder: "",
				required: true,
				description: "Location Latitude",
				displayOptions: {
					show: {
						messageType: ['location'],
					},
				}
			},
			{
				displayName: "Longitude",
				name: "longitude",
				type: "number",
				default: 0,
				placeholder: "",
				required: true,
				description: "Location Longtidue",
				displayOptions: {
					show: {
						messageType: ['location'],
					},
				}
			},
			{
				displayName: "Alt Text",
				name: "altText",
				type: "string",
				default: "",
				placeholder: "",
				required: true,
				description: "Alternative text. When a user receives a message, it will appear in the device's notifications, talk list, and quote messages as an alternative to the Flex. Max character limit: 400",
				displayOptions: {
					show: {
						messageType: ['flex'],
					},
				}
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
			const messageType = this.getNodeParameter('messageType', i) as string;
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
			}

			const replyToken = this.getNodeParameter('replyToken', i) as string;
			returnData.push({
				json: {
					replyToken,
					message
				},
			});
		}
		return this.prepareOutputData(returnData);
	}
}
