import { Cloudflare } from '@module/cloudflare/cloudflare';

export class CloudflareStream {
	private readonly stream: Cloudflare;

	constructor() {
		this.stream = new Cloudflare('live_inputs');
	}

	async createChannel(name: string): Promise<any> {
		const body = {
			defaultCreator: 'string',
			deleteRecordingAfterDays: 30,
			meta: {
				name,
			},
			recording: {
				mode: 'automatic',
				requireSignedURLs: false,
				timeoutSeconds: 0,
			},
		};

		return await this.stream.post(body);
	}
}
