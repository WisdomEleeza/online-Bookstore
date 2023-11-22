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

module.exports = { register, login };
