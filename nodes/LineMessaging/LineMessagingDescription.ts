import type { INodeProperties } from 'n8n-workflow';

export const messagingAPIOperations: INodeProperties[] = [
	{
		displayName: "Operations",
		name: "operation",
		type: "options",
		noDataExpression: true,
		options: [
			{
				name: "Send Message",
				value: "message",
				description: "Send or reply a message",
				action: "Send a message"
			},
			{
				name: 'Get Message Content',
				value: "getMessageContent",
				description: "Get the message content",
				action: "Get message content"
			}
		],
		default: "message",
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'json',
		default: '',
		placeholder: '',
		required: true,
		description: 'The message payload',
		displayOptions: {
			show: {
				operation: ['message']
			}
		}
	},
	{
		displayName: 'ReplyToken',
		name: 'replyToken',
		type: 'string',
		default: '',
		placeholder: '',
		description: 'The reply token for reply message',
		displayOptions: {
			show: {
				operation: ['message']
			}
		}
	},
	{
		displayName: 'Message ID',
		name: 'messageId',
		type: 'string',
		default: '',
		placeholder: '',
		description: 'The message ID to retrieve message content',
		displayOptions: {
			show: {
				operation: ['getMessageContent']
			}
		}
	}
];
