import { UUIDController } from '@module/uuid/infrastructure/uuid.controller';
import { SentInfo } from '../../domain/email.type';
import { EmailController } from '../../infrastructure/controller/email.controller';
import { EmailTemplateController } from '../../infrastructure/controller/email.template.controller';
import { EmailTrackingUser } from './email.tracking.user.service';

export class EmailService {
	private readonly email: EmailController;
	private readonly template: EmailTemplateController;
	private readonly track: EmailTrackingUser;
	private readonly uuid: UUIDController;

	constructor(template: string) {
		this.email = new EmailController();
		this.template = new EmailTemplateController(template);
		this.track = new EmailTrackingUser();
		this.uuid = new UUIDController();
	}

	async send(to: string, data: Record<string, unknown>): Promise<SentInfo> {
		const subject = 'Confirmación de cuenta';

		const uuid = this.uuid.create();

		if (data?.lang) this.template.setLang(data.lang as string);

		data.trackImage = this.track.getHTML(uuid);

		const html = this.template.getHTML(data);

		this.email.setParams({ to, subject, html });

		await this.track.savePending(
			uuid,
			this.template.getName(),
			data.user_id as number,
		);

		const response = await this.email.send();

		const method = response.accepted.length > 0 ? 'saveSent' : 'saveError';

		this.track[method](uuid);

		return response;
	}
}
