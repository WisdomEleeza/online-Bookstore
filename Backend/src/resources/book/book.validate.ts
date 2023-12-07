import Joi from "joi";

const BookValidation = Joi.object({
  title: Joi.string().max(255).required(),

  author: Joi.string().max(255).required(),

  ISBN: Joi.string().max(255).required(),

  genre: Joi.string().max(255).required(),

  price: Joi.number().max(255).required(),

  quantityAvailable: Joi.number().max(255).required(),
});

export default { BookValidation };
