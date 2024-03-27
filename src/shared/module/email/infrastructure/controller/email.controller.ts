import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { EmailProps, SentInfo, Transport } from '../../domain/email.type';

export class EmailController {
	private readonly transport: Transport;
	private readonly from: string;
	private subject: string;
	private html: string;
	private text: string;
	private to: string;

	constructor() {
		this.transport = this.getTransport();
		this.from = process.env.EMAIL_FROM;
	}

	private getTransport(): Transport {
		const options: SMTPTransport.Options = {
			host: process.env.EMAIL_HOST,
			port: parseInt(process.env.EMAIL_PORT),
			auth: {
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS,
			},
		};

		return nodemailer.createTransport(options);
	}

	private formatSubject(subject: string): string {
		return `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;
	}

	replaceSubject(data: any): string {
		return this.subject.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()]);
	}

	setParams(params: EmailProps): void {
		this.subject = params?.subject;
		this.html = params?.html;
		this.text = params?.text;
		this.to = params?.to;
	}

	async send(): Promise<SentInfo> {
		if (!this.to)
			throw new Error('EmailService: Requiere de un destinatario');

		if (!this.subject)
			throw new Error('EmailService: Requiere de un asunto');

		if (!this.html && !this.text)
			throw new Error('EmailService: Requiere de un contenido');

		const params = {
			from: this?.from,
			to: this?.to,
			subject: this.formatSubject(this?.subject),
			html: this?.html,
			text: this?.text,
		};

		return await this.transport.sendMail(params);
	}
}
