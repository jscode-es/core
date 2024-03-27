import { Cloudflare } from '@module/cloudflare/cloudflare';

export class CloudflareCache {
	private readonly stream: Cloudflare;

	constructor() {
		this.stream = new Cloudflare('purge_cache');
	}

	async remove(url: string): Promise<any> {
		return await this.stream.post({
			prefixes: [url],
		});
	}
}
