import Joi from "joi";

const Book = Joi.object({
  title: Joi.string().max(255).required(),

  author: Joi.string().max(255).required(),

  ISBN: Joi.string().max(255).required(),

  genre: Joi.string().max(255).required(),

  price: Joi.string().max(255).required(),

  quantityAvailable: Joi.string().max(255).required(),
});

export default { Book };
