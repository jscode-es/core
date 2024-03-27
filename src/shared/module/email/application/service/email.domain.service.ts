import { EmailMxController } from '@module/email/infrastructure/controller/email.mx.controller';

export class EmailValidDomain {
	private readonly emailMx: EmailMxController;

	constructor() {
		this.emailMx = new EmailMxController();
	}

	async exec(email: string): Promise<boolean> {
		return await this.emailMx.exec(email);
	}
}
