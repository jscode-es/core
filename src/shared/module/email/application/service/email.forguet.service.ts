import { SentInfo } from '../../domain/email.type';
import { EmailService } from './email.service';

export class EmailForguet {
	private readonly email: EmailService;

	constructor() {
		this.email = new EmailService('forgot');
	}

	async send(to: string, data: Record<string, unknown>): Promise<SentInfo> {
		return this.email.send(to, data);
	}
}
