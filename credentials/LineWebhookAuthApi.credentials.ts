import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LineWebhookAuthApi implements ICredentialType {
	name = 'lineWebhookAuthApi';
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-display-name-missing-api
	displayName = 'Line Webhook Auth Credential';
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
