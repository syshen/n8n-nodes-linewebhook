import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class LineMessage implements INodeType {
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
				displayName: 'ImageUrl',
				name: 'originalContentUrl',
				type: 'string',
				default: '',
				placeholder: '',
				required: true,
				description: 'The image URL'
			},
			{
				displayName: 'PreviewUrl',
				name: 'previewImageUrl',
				type: 'string',
				default: '',
				placeholder: '',
				required: true,
				description: 'Image preview thumbnail URL'
			}

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
			returnData.push({
				json: {
					type: 'image',
					originalContentUrl,
					previewImageUrl
			}});
		}
		return this.prepareOutputData(returnData);
	}
}
