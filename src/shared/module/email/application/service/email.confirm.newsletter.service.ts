import { SentInfo } from '../../domain/email.type';
import { EmailService } from './email.service';

export class EmailConfirmNewsletter {
	private readonly email: EmailService;

	constructor() {
		this.email = new EmailService('confirm');
	}

	async send(to: string, data: Record<string, unknown>): Promise<SentInfo> {
		return this.email.send(to, data);
	}
}
