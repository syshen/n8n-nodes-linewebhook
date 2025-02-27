import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	ICredentialDataDecryptedObject,
} from 'n8n-workflow';

import { messagingAPIOperations } from './LineMessagingDescription';
import { LineAuthenticationError, LineApiError, LineValidationError } from '../errors';

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
		let credentials;
		try {
			credentials = await this.getCredentials('lineMessagingAuthApi') as {
				channel_access_token: string
			};
			
			if (!credentials?.channel_access_token) {
				throw new LineAuthenticationError(
					this.getNode(), 
					'LINE channel access token is missing'
				);
			}
		} catch (error) {
			if (error.name === 'LineAuthenticationError') {
				throw error;
			}
			throw new LineAuthenticationError(
				this.getNode(),
				'Failed to load LINE API credentials'
			);
		}

		let client, blobClient;
		try {
			client = new MessagingApiClient({
				channelAccessToken: credentials.channel_access_token,
			});
			blobClient = new MessagingApiBlobClient({
				channelAccessToken: credentials.channel_access_token,
			});
		} catch (error) {
			throw new LineApiError(this.getNode(), error, {
				description: 'Failed to initialize LINE API client'
			});
		}

		const items = this.getInputData();
		const length = items.length;
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				
				if (operation === 'message') {
					try {
						const replyToken = this.getNodeParameter('replyToken', i) as string;
						const message = this.getNodeParameter('message', i);
						
						if (!message) {
							throw new LineValidationError(
								this.getNode(),
								'Message content is required',
								'Please provide a valid message to send'
							);
						}
						
						let messages: messagingApi.Message[] = [];
						if (message instanceof Array) {
							messages = message as messagingApi.Message[];
						} else {
							messages = [message as messagingApi.Message];
						}
						
						try {
							if (replyToken) {
								await client.replyMessage({
									replyToken,
									messages: messages,
								});
							} else {
								const targetRecipient = this.getNodeParameter('targetRecipient', i) as string;
								if (!targetRecipient) {
									throw new LineValidationError(
										this.getNode(),
										'Target recipient is required when not using reply token',
										'Please provide either a reply token or a target recipient'
									);
								}
								
								await client.pushMessage({
									to: targetRecipient,
									messages: messages,
								});
							}
						} catch (error) {
							throw new LineApiError(this.getNode(), error.response?.data, {
								description: 'Failed to send LINE message',
								itemIndex: i
							});
						}
						
						returnData.push(items[i]);
					} catch (error) {
						if (error.name === 'LineValidationError' || error.name === 'LineApiError') {
							throw error;
						}
						throw new LineValidationError(
							this.getNode(),
							`Failed to process message operation: ${error.message}`,
							'Check your message parameters'
						);
					}
				} else if (operation === 'multicast') {
					try {
						const targetRecipients = this.getNodeParameter('targetRecipients', i) as string[];
						const message = this.getNodeParameter('message', i);
						
						if (!targetRecipients || targetRecipients.length === 0) {
							throw new LineValidationError(
								this.getNode(),
								'Target recipients are required for multicast',
								'Please provide at least one recipient user ID'
							);
						}
						
						if (!message) {
							throw new LineValidationError(
								this.getNode(),
								'Message content is required',
								'Please provide a valid message to send'
							);
						}
						
						let messages: messagingApi.Message[] = [];
						if (message instanceof Array) {
							messages = message as messagingApi.Message[];
						} else {
							messages = [message as messagingApi.Message];
						}
						
						try {
							await client.multicast({
								to: targetRecipients,
								messages: messages,
							});
							
							returnData.push({
								json: {
									success: true,
									recipients: targetRecipients,
									messageCount: messages.length
								}
							});
						} catch (error) {
							throw new LineApiError(this.getNode(), error.response?.data, {
								description: 'Failed to send multicast LINE message',
								itemIndex: i
							});
						}
					} catch (error) {
						if (error.name === 'LineValidationError' || error.name === 'LineApiError') {
							throw error;
						}
						throw new LineValidationError(
							this.getNode(),
							`Failed to process multicast operation: ${error.message}`,
							'Check your multicast parameters'
						);
					}
				} else if (operation === 'getMessageContent') {
					try {
						const messageId = this.getNodeParameter('messageId', i) as string;
						
						if (!messageId) {
							throw new LineValidationError(
								this.getNode(),
								'Message ID is required',
								'Please provide a valid message ID'
							);
						}
						
						try {
							const { httpResponse, body } = await blobClient.getMessageContentWithHttpInfo(messageId);
							const contentType = httpResponse.headers.get('content-type') as string;
							
							returnData.push({
								json: {
									contentType
								},
								binary: {
									data: await this.helpers.prepareBinaryData(
										body, 'data', contentType
									),
								}
							});
						} catch (error) {
							throw new LineApiError(this.getNode(), error.response?.data, {
								description: 'Failed to get message content',
								itemIndex: i
							});
						}
					} catch (error) {
						if (error.name === 'LineValidationError' || error.name === 'LineApiError') {
							throw error;
						}
						throw new LineValidationError(
							this.getNode(),
							`Failed to get message content: ${error.message}`,
							'Check the message ID'
						);
					}
				} else if (operation === 'getGroupChatSummary') {
					try {
						const groupId = this.getNodeParameter('groupId', i) as string;
						
						if (!groupId) {
							throw new LineValidationError(
								this.getNode(),
								'Group ID is required',
								'Please provide a valid group ID'
							);
						}
						
						try {
							const group_summary_resp = await client.getGroupSummary(groupId);
							returnData.push({json: group_summary_resp});
						} catch (error) {
							throw new LineApiError(this.getNode(), error.response?.data, {
								description: 'Failed to get group summary',
								itemIndex: i
							});
						}
					} catch (error) {
						if (error.name === 'LineValidationError' || error.name === 'LineApiError') {
							throw error;
						}
						throw new LineValidationError(
							this.getNode(),
							`Failed to get group summary: ${error.message}`,
							'Check the group ID'
						);
					}
				} else if (operation === 'getGroupChatMemberUserIds') {
					try {
						const groupId = this.getNodeParameter('groupId', i) as string;
						
						if (!groupId) {
							throw new LineValidationError(
								this.getNode(),
								'Group ID is required',
								'Please provide a valid group ID'
							);
						}
						
						try {
							const group_member_user_ids_resp = await client.getGroupMembersIds(groupId);
							returnData.push({json: group_member_user_ids_resp});
						} catch (error) {
							throw new LineApiError(this.getNode(), error.response?.data, {
								description: 'Failed to get group member user IDs',
								itemIndex: i
							});
						}
					} catch (error) {
						if (error.name === 'LineValidationError' || error.name === 'LineApiError') {
							throw error;
						}
						throw new LineValidationError(
							this.getNode(),
							`Failed to get group member user IDs: ${error.message}`,
							'Check the group ID'
						);
					}
				} else if (operation === 'getGroupChatMemberProfile') {
					try {
						const groupId = this.getNodeParameter('groupId', i) as string;
						const userId = this.getNodeParameter('userId', i) as string;
						
						if (!groupId) {
							throw new LineValidationError(
								this.getNode(),
								'Group ID is required',
								'Please provide a valid group ID'
							);
						}
						
						if (!userId) {
							throw new LineValidationError(
								this.getNode(),
								'User ID is required',
								'Please provide a valid user ID'
							);
						}
						
						try {
							const group_member_profile_resp = await client.getGroupMemberProfile(groupId, userId);
							returnData.push({json: group_member_profile_resp});
						} catch (error) {
							throw new LineApiError(this.getNode(), error.response?.data, {
								description: 'Failed to get group member profile',
								itemIndex: i
							});
						}
					} catch (error) {
						if (error.name === 'LineValidationError' || error.name === 'LineApiError') {
							throw error;
						}
						throw new LineValidationError(
							this.getNode(),
							`Failed to get group member profile: ${error.message}`,
							'Check the group ID and user ID'
						);
					}
				} else if (operation === 'getProfile') {
					try {
						const userId = this.getNodeParameter('userId', i) as string;
						
						if (!userId) {
							throw new LineValidationError(
								this.getNode(),
								'User ID is required',
								'Please provide a valid user ID'
							);
						}
						
						try {
							const user_profile_resp = await client.getProfile(userId);
							returnData.push({json: user_profile_resp});
						} catch (error) {
							throw new LineApiError(this.getNode(), error.response?.data, {
								description: 'Failed to get user profile',
								itemIndex: i
							});
						}
					} catch (error) {
						if (error.name === 'LineValidationError' || error.name === 'LineApiError') {
							throw error;
						}
						throw new LineValidationError(
							this.getNode(),
							`Failed to get user profile: ${error.message}`,
							'Check the user ID'
						);
					}
				} else {
					throw new LineValidationError(
						this.getNode(),
						`Unsupported operation: ${operation}`,
						'Please select a valid operation'
					);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
							errorDescription: error.description,
							operation: this.getNodeParameter('operation', i),
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
