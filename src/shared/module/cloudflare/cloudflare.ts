// ====================================
// Este modulo se encarga de enviar eventos
// a un servidor de cloudflare.
// ====================================

export class Cloudflare {
	private URL_BASE: string;
	private AUTHORIZATION: string;

	constructor(service: string) {
		this.URL_BASE = `https://api.cloudflare.com/client/v4/${this.getSection(
			service,
		)}/${process.env.CLOUDFLARE_ACCOUNT_ID}/${service}`;
		this.AUTHORIZATION = `Bearer ${process.env.CLOUDFLARE_API_KEY}`;
	}

	private getSection(service: string): string {
		return service === 'purge_cache' ? 'zones' : 'accounts';
	}

	private async makeRequest(method: string, body?: any): Promise<any> {
		const headers: Record<string, string> = {
			'Content-Type': 'application/json',
			Authorization: this.AUTHORIZATION,
		};

		const requestOptions: RequestInit = {
			method,
			headers,
		};

		if (body) {
			requestOptions.body = JSON.stringify(body);
		}

		const response = await fetch(`${this.URL_BASE}`, requestOptions);

		return response.json();
	}

	async get(): Promise<any> {
		return this.makeRequest('GET');
	}

	async post(body: any): Promise<any> {
		return this.makeRequest('POST', body);
	}

	async put(body: any): Promise<any> {
		return this.makeRequest('PUT', body);
	}

	async delete(): Promise<any> {
		return this.makeRequest('DELETE');
	}
}
