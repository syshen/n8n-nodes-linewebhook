import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LineMessagingAuthApi implements ICredentialType {
	name = 'lineMessagingAuthApi';
	displayName = 'Line Messaging Auth API';
	properties: INodeProperties[] = [
		{
			displayName: 'Channel Access Token',
			name: 'channel_access_token',
			type: 'string',
			typeOptions: { password: true },
			default: '',
		},
	];
}
