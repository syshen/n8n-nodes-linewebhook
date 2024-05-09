import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ICredentialDataDecryptedObject,
	NodeApiError,
} from 'n8n-workflow';

import { messagingAPIOperations } from './LineMessagingDescription';

import { messagingApi } from '@line/bot-sdk';
const { MessagingApiClient, MessagingApiBlobClient } = messagingApi;

export class LineMessaging implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Line Messaging API',
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
			...messagingAPIOperations
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
		const blobClient = new MessagingApiBlobClient({
			channelAccessToken: expectedCred.channel_access_token as string,
		})

		const items = this.getInputData();
		const length = items.length;
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			if (operation === 'message') {
				const replyToken = this.getNodeParameter('replyToken', i) as string;
				const message = this.getNodeParameter('message', i) as messagingApi.Message;
				if (replyToken) {
					await client.replyMessage({
						replyToken,
						messages: [ message ],
					});
				} else {

				}
				returnData.push(items[i]);

			} else if (operation === 'getMessageContent') {
				const messageId = this.getNodeParameter('messageId', i) as string;
				const fp = await blobClient.getMessageContent(messageId);
				const blob = await new Response(fp).blob();
				returnData.push({json: {
					data: blob
				}});
			}
		}
		return this.prepareOutputData(returnData);

	}
}
