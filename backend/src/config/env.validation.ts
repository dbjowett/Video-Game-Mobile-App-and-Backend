import Joi from 'joi';

export const validationSchema = Joi.object({
  IGDB_CLIENT_ID: Joi.string(),
  IGDB_CLIENT_SECRET: Joi.string(),

  JWT_SECRET: Joi.string(),
  JWT_REFRESH_SECRET: Joi.string(),

  GOOGLE_CLIENT_ID: Joi.string(),
  GOOGLE_CLIENT_SECRET: Joi.string(),
  GOOGLE_CALLBACK_URL: Joi.string().uri(),

  FE_URL: Joi.string().uri(),
  PORT: Joi.string(),
  NODE_ENV: Joi.string().valid('development', 'production'),
  DATABASE_URL: Joi.string().uri(),
}).options({ presence: 'required' });
