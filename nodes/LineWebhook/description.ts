import type { IWebhookDescription } from 'n8n-workflow';

export const defaultWebhookDescription: IWebhookDescription = {
	name: 'default',
	httpMethod: '={{$parameter["httpMethod"] || "POST"}}',
	isFullPath: true,
	responseCode: '200',
	responseMode: 'responseNode',
	responseData: 'allEntries',
	responseBinaryPropertyName: '={{$parameter["responseBinaryPropertyName"]}}',
	responseContentType: 'application/json',
	responsePropertyName: '={{$parameter["options"]["responsePropertyName"]}}',
	responseHeaders: '={{$parameter["options"]["responseHeaders"]}}',
	path: '={{$parameter["path"]}}',
};

