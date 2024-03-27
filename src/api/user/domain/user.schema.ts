import * as Joi from 'joi';

export const RegisterUserSchema = Joi.object({
	alias: Joi.string().required(),
	email: Joi.string().email().required(),
	password: Joi.string().required(),
	birthdate: Joi.date().iso().required(),
});

export const UpdateUserSchema = Joi.object({
	alias: Joi.string(),
	email: Joi.string().email(),
	password: Joi.string(),
	birthdate: Joi.date().iso(),
});

export const RemoveUserSchema = Joi.object({
	id: Joi.string().required(),
});
