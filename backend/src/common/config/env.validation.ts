// ** Be sure to add any new env vars to .env
import Joi from 'joi';

export const validationSchema = Joi.object({
  // ** Nest config **
  PORT: Joi.string(),
  NODE_ENV: Joi.string().valid('development', 'production'),

  // ** IGDB **
  IGDB_CLIENT_ID: Joi.string(),
  IGDB_CLIENT_SECRET: Joi.string(),

  // ** JWT Auth **
  JWT_SECRET: Joi.string(),
  JWT_REFRESH_SECRET: Joi.string(),

  // ** Google Auth **
  GOOGLE_CLIENT_ID: Joi.string(),
  GOOGLE_CLIENT_SECRET: Joi.string(),
  GOOGLE_CALLBACK_URL: Joi.string().uri(),

  // ** Postgres DB url **
  DATABASE_URL: Joi.string().uri(),

  // ** FE URL **
  FE_URL: Joi.string().uri(),

  // ** AWS S3 **
  AWS_BUCKET: Joi.string(),
  AWS_REGION: Joi.string(),
  AWS_ACCESS_KEY: Joi.string(),
  AWS_SECRET_ACCESS_KEY: Joi.string(),
}).options({ presence: 'required' });
