import {
	// IAuthenticateGeneric,
	// ICredentialTestRequest,
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
/*
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.sendgrid.com/v3',
			url: '/marketing/contacts',
		},
	};
	*/
}
