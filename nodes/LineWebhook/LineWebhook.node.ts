import {
	IDataObject,
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	ICredentialDataDecryptedObject,
	NodeApiError,
} from 'n8n-workflow';
import {
	defaultWebhookDescription,
} from './description';
import crypto from 'crypto';

// class WebhookAuthorizationError extends Error {
// 	constructor(
// 		readonly responseCode: number,
// 		message?: string,
// 	) {
// 		if (message === undefined) {
// 			message = 'Authorization problem!';
// 			if (responseCode === 401) {
// 				message = 'Authorization is required!';
// 			} else if (responseCode === 403) {
// 				message = 'Authorization data is wrong!';
// 			}
// 		}
// 		super(message);
// 	}
// }

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
		outputs: ['main'],
		webhooks: [defaultWebhookDescription],
		credentials: [
			{
				name: 'lineWebhookAuthApi',
				required: false,
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

		const returnData: IDataObject[] = [];
		returnData.push({
			headers: headers,
			params: this.getParamsData(),
			query: this.getQueryData(),
			body: this.getBodyData(),
		});

		// const req = this.getRequestObject();
		const resp = this.getResponseObject();
		// const requestMethod = this.getRequestObject().method;

		try {
			let expectedCred: ICredentialDataDecryptedObject | undefined;
			expectedCred = await this.getCredentials('lineWebhookAuthApi') as {
				channel_secret: string
			};
			if (expectedCred === undefined || !expectedCred.channel_secret) {
				// Data is not defined on node so can not authenticate
				console.error('No auth provided');
				throw new NodeApiError(this.getNode(), {});
				// throw new WebhookAuthorizationError(500, 'No authentication data defined on node!');
			}

			// const expectedValue = crypto.createHmac('SHA256', expectedCred.channel_secret as string).update(body).digest();
			if (
				!headers.hasOwnProperty(headerName) ||
				!validateSignature(body, expectedCred.channel_secret as string, (headers as IDataObject)[headerName] as string)
			) {
				// Provided authentication data is wrong
				throw new NodeApiError(this.getNode(), {});
				// throw new WebhookAuthorizationError(403);
			}
		} catch(error) {
			console.error(error);
			// if (error instanceof WebhookAuthorizationError) {
				resp.writeHead(error.responseCode, { 'WWW-Authenticate': 'Basic realm="Webhook"' });
				resp.end(error.message);
				return { noWebhookResponse: true };
			// }
			throw error;
		}

		return {
			workflowData: [this.helpers.returnJsonArray(returnData)],
		};
	}

}
