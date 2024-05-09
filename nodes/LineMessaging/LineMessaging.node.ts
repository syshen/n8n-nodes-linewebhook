import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ICredentialDataDecryptedObject,
	NodeApiError,
} from 'n8n-workflow';

import { messagingApi } from '@line/bot-sdk';
const { MessagingApiClient } = messagingApi;

export class LineMessaging implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LineMessaging',
		name: 'LineMessaging',
		icon: 'file:line.svg',
		group: ['transform'],
		version: 1,
		description: 'Line Messaging API',
		defaults: {
			name: 'LineMessaging',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'lineMessagingAuthApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Message',
				name: 'message',
				type: 'json',
				default: '',
				placeholder: '',
				required: true,
				description: 'The message payload'
			},
			{
				displayName: 'ReplyToken',
				name: 'replyToken',
				type: 'string',
				default: '',
				placeholder: '',
				description: 'The reply token for reply message'
			}
		],
	};

	// The execute method will go here
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let expectedCred: ICredentialDataDecryptedObject | undefined;
		expectedCred = await this.getCredentials('lineMessagingAuthApi') as {
			channel_access_token: string
		};
		if (expectedCred === undefined || !expectedCred.channel_access_token) {
			// Data is not defined on node so can not authenticate
			console.error('No auth provided');
			throw new NodeApiError(this.getNode(), {});
		}

		const client = new MessagingApiClient({
			channelAccessToken: expectedCred.channel_access_token as string,
		});

		const items = this.getInputData();
		const length = items.length;
		for (let i = 0; i < length; i++) {
			const replyToken = this.getNodeParameter('replyToken', i) as string;
			const message = this.getNodeParameter('message', i) as messagingApi.Message;
			if (replyToken) {
				await client.replyMessage({
					replyToken,
					messages: [ message ],
				});
			}
		}
		return this.prepareOutputData(items);
	}
}
