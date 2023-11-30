import Joi from "joi";

const Book = Joi.object({
  title: Joi.string().max(255).required(),

  
});

export default { Book };
