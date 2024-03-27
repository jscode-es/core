import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export const Template = {
	forgot: {
		subject: '🔑 Recuperar contraseña',
	},
	passwordUpdated: {
		subject: '🔑 Contraseña actualizada',
	},
	subscriptionActivated: {
		subject: '👍 Suscripción activada',
	},
	subscriptionCanceled: {
		subject: '🙁 Suscripción cancelada',
	},
	subscriptionExpired: {
		subject: '😯 Suscripción expirada',
	},
	subscriptionReactivated: {
		subject: '😍 Suscripción reactivada',
	},
	welcome: {
		subject: '👋 Bienvenido {{name}}',
	},
	confirm: {
		subject: 'Confirmar correo electrónico {{name}}',
	},
};

export type TemplateName = keyof typeof Template;

export type Transport = nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
export type SentInfo = SMTPTransport.SentMessageInfo;

export type subject = string;
export type html = string;
export type text = string;
export type to = string;

export interface EmailProps {
	subject: subject;
	html?: html;
	text?: text;
	to: to;
}

export enum Status {
	FAIL = 'FAIL',
	PENDING = 'PENDING',
	SENT = 'SENT',
	SEEN = 'SEEN',
}
