import type { INodeProperties } from 'n8n-workflow';

export const messageTypes: INodeProperties[] = [
	{
		displayName: 'Message Type',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Audio',
				value: 'audio',
				description: 'Audio message',
				action: 'Create an audio message',
			},
			{
				name: 'Flex',
				value: 'flex',
				description: 'Flexible type message',
				action: 'Create a flex message',

			},
			{
				name: 'Image',
				value: 'image',
				description: 'Image message',
				action: 'Create an image message',
			},
			{
				name: 'Location',
				value: 'location',
				description: 'Location message',
				action: 'Create a location message',
			},
			{
				name: 'Sticker',
				value: 'sticker',
				description: 'Sticker message',
				action: 'Create a sticker message',
			},
			{
				name: 'Text',
				value: 'text',
				description: 'Plain text message',
				action: 'Create a text message',
			},
			{
				name: 'Video',
				value: 'video',
				description: 'Video message',
				action: 'Create a video message',
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
				operation: ['text'],
			},
		}
	},
	// Sticker
	{
		displayName: 'Package ID',
		name: 'packageId',
		type: 'string',
		default: '',
		placeholder: '',
		required: true,
		description: 'Package ID for a set of stickers. For information on package IDs, see the https://developers.line.biz/en/docs/messaging-api/sticker-list/ .',
		displayOptions: {
			show: {
				operation: ['sticker'],
			},
		},
	},
	{
		displayName: 'Sticker ID',
		name: 'stickerId',
		type: 'string',
		default: '',
		placeholder: '',
		required: true,
		description: 'Sticker ID. For a list of sticker IDs for stickers that can be sent with the Messaging API, see the https://developers.line.biz/en/docs/messaging-api/sticker-list/ .',
		displayOptions: {
			show: {
				operation: ['sticker'],
			},
		},
	},
	{
		displayName: 'Quote Token',
		name: 'quoteToken',
		type: 'string',
		default: '',
		placeholder: '',
		description: 'Quote token of the message you want to quote',
		displayOptions: {
			show: {
				operation: ['sticker'],
			},
		}
	},
	// video, audio, image
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
				operation: ['image', 'audio', 'video'],
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
				operation: ['image', 'video'],
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
				operation: ['audio', 'video'],
			},
		},
	},
	// audio
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
				operation: ['audio'],
			},
		}
	},
	// Location
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
				operation: ['location'],
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
				operation: ['location'],
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
				operation: ['location'],
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
				operation: ['location'],
			},
		}
	},
	// Flex messaage type options
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
				operation: ['flex'],
			},
		}
	},
	{
		displayName: "Flex Content",
		name: "flexContent",
		type: "json",
		default: '',
		placeholder: '',
		required: true,
		description: "The message payload for Flex message. Use Flex simulator to create message payload and paste the JSON code here.",
		displayOptions: {
			show: {
				operation: ['flex'],
			},
		}
	},
];
