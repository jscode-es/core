import * as Joi from 'joi';

export const RegisterChannelSchema = Joi.object({
	name: Joi.string().required(),
	description: Joi.string().required(),
	id: Joi.number(),
});
