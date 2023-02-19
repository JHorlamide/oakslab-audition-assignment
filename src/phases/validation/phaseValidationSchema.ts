import Joi from "joi";

export const phaseSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
})

export const taskSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required()
})

export const completeTaskSchema = Joi.object({
  completed: Joi.boolean().required()
})
