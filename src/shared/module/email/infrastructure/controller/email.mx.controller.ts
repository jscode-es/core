import * as dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

export class EmailMxController {
	constructor() {}

	async exec(email: string): Promise<boolean> {
		const domain = email.split('@')[1].toLowerCase();

		try {
			const registrosMx = await resolveMx(domain);
			return registrosMx && registrosMx.length > 0;
		} catch (error) {
			return false;
		}
	}
}
