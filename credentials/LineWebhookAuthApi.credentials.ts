import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LineWebhookAuthApi implements ICredentialType {
	name = 'lineWebhookAuthApi';
	displayName = 'Line Webhook Auth API';
	properties: INodeProperties[] = [
		{
			displayName: 'Channel Secret',
			name: 'channel_secret',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
