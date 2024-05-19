import type { INodeProperties } from 'n8n-workflow';

export const messagingAPIOperations: INodeProperties[] = [
	{
		displayName: 'Operations',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Get Group Chat Member User IDs',
				value: 'getGroupChatMemberUserIds',
				description:
					'Gets the user IDs of the members of a group chat that the LINE Official Account is in. This includes user IDs of users who have not added the LINE Official Account as a friend or has blocked the LINE Official Account.',
				action: 'Get group chat member user ids',
			},
			{
				name: 'Get Group Chat Summary',
				value: 'getGroupChatSummary',
				description:
					'Gets the group ID, group name, and group icon URL of a group chat where the LINE Official Account is a member',
				action: 'Get group chat summary',
			},
			{
				name: 'Get Message Content',
				value: 'getMessageContent',
				description:
					'Gets images, videos, audio, and files sent by users using message IDs received via the webhook',
				action: 'Get message content',
			},
			{
				name: 'Get User Profile',
				value: 'getProfile',
				description: 'You can get the profile information of users',
				action: 'Get user profile',
			},
			{
				name: 'Send Message',
				value: 'message',
				description: 'Send or reply a message',
				action: 'Send a message',
			},
		],
		default: 'message',
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
				operation: ['message'],
			},
		},
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
				operation: ['message'],
			},
		},
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
				operation: ['getMessageContent'],
			},
		},
	},
	{
		displayName: 'Group ID',
		name: 'groupId',
		type: 'string',
		default: '',
		placeholder: '',
		description: 'Group ID. Found in the source object of webhook event objects.',
		displayOptions: {
			show: {
				operation: ['getGroupChatSummary', 'getGroupChatMemberUserIds'],
			},
		},
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
		placeholder: '',
		description: 'User ID that is returned in a webhook event object. Do not use the LINE ID found on LINE.',
		displayOptions: {
			show: {
				operation: ['getProfile'],
			},
		},
	}
];
