import Joi from "joi";

const register = Joi.object({
  name: Joi.string().max(255),

  email: Joi.string().max(255).required(),

  password: Joi.string().min(8).required(),
});

const login = Joi.object({
  email: Joi.string().max(255).required(),

  password: Joi.string().min(8).required(),
});

const userProfile = Joi.object({
  name: Joi.string().max(255),

  shippingAddress: Joi.string().max(255),

  paymentMethod: Joi.string().max(255),
});

export default { login, register, userProfile };
