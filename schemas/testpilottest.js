"use strict";

const Joi = require("joi-browser");
const commonSchema = require("./commonSchema");

const schema = commonSchema.keys({
  test: Joi.string().required(),
  timestamp: Joi.number().integer().required(),
  payload: Joi.object().min(1).required(),
  variants: Joi.object().allow(null).required(),
  version: Joi.string().required()
}).options({allowUnknown: true});

module.exports = schema;
