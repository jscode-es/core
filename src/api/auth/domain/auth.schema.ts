import * as Joi from 'joi';

export const LoginAuthSchema = Joi.object({
	alias: Joi.string().required(),
	password: Joi.string().required(),
});
