import {
	IDataObject,
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	ICredentialDataDecryptedObject,
	NodeApiError,
	INodeInputConfiguration,
	INodeExecutionData,
} from 'n8n-workflow';
import {
	defaultWebhookDescription,
} from './description';
import crypto from 'crypto';


function s2b(str: string, encoding: BufferEncoding): Buffer {
  return Buffer.from(str, encoding);
}

function safeCompare(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

function validateSignature(
  body: string | Buffer,
  channelSecret: string,
  signature: string,
): boolean {
  return safeCompare(
    crypto.createHmac("SHA256", channelSecret).update(body.toString('utf8')).digest(),
    s2b(signature, "base64"),
  );
}

function outputs(): INodeInputConfiguration[] {
	return [
		{
			displayName: 'text',required: false, type: 'main'
		},
		{
			displayName: 'audio', required: false, type: 'main'
		},
		{
			displayName: 'flex', required: false, type: 'main',
		},
		{
			displayName: 'sticker', required: false, type: 'main',
		},
		{
			displayName: 'image', required: false, type: 'main',
		},
		{
			displayName: 'video', required: false, type: 'main',
		},
		{
			displayName: 'location', required: false, type: 'main',
		},
		{
			displayName: 'imagemap', required: false, type: 'main',
		},
		{
			displayName: 'template', required: false, type: 'main',
		},
	]
}

function indexOfOuputs(type: string) {
	for (let index = 0; index < outputs().length; index++) {
		if (outputs()[index].displayName === type) {
			return index;
		}
	}
	return null;
}

export class LineWebhook implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LineWebhook',
		name: 'LineWebhook',
		icon: 'file:line.svg',
		group: ['trigger'],
		version: 1,
		description: 'Line Webhook',
		defaults: {
			name: 'LineWebhook',
		},
		inputs: ['main'],
		outputs: outputs(),
		webhooks: [defaultWebhookDescription],
		credentials: [
			{
				name: 'lineWebhookAuthApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '',
				placeholder: 'line-webhook',
				required: true,
				description: 'The path to listen to'
			}
		],
	};

	// The execute method will go here
	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const headerName = 'x-line-signature';
		const headers = this.getHeaderData();
		const req = this.getRequestObject();
		const body = req.rawBody;

		try {
			let expectedCred: ICredentialDataDecryptedObject | undefined;
			expectedCred = await this.getCredentials('lineWebhookAuthApi') as {
				channel_secret: string
			};
			if (expectedCred === undefined || !expectedCred.channel_secret) {
				// Data is not defined on node so can not authenticate
				console.error('No auth provided');
				throw new NodeApiError(this.getNode(), {});
			}

			if (
				!headers.hasOwnProperty(headerName) ||
				!validateSignature(body, expectedCred.channel_secret as string, (headers as IDataObject)[headerName] as string)
			) {
				// Provided authentication data is wrong
				throw new NodeApiError(this.getNode(), {});
			}
		} catch(error) {
			const resp = this.getResponseObject();
			resp.writeHead(error.responseCode, { 'WWW-Authenticate': 'Basic realm="Webhook"' });
			resp.end(error.message);
			return { noWebhookResponse: true };
		}

		const returnData: IDataObject[][] = [
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[],
			[]
		];

		const bodyObject = this.getBodyData();
		const destination = bodyObject['destination'];
		if (bodyObject['events']) {
			for (const event of (bodyObject['events'] as Array<IDataObject>)) {
				const type = (event['message'] as IDataObject)['type'];
				const oi = indexOfOuputs(type as string);
				if (oi !== null) {
					returnData[oi].push({
						destination: destination,
						event: event
					});
				}
			}
		}

		const outputData: INodeExecutionData[][] = [];
		for (let idx = 0; idx < returnData.length; idx++) {
			outputData.push(this.helpers.returnJsonArray(returnData[idx]));
		}

		return {
			workflowData: outputData,
		};
	}
}
