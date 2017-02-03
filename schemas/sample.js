"use strict";

const Joi = require("joi-browser");
const commonSchema = require("./commonSchema");

const schema = commonSchema.keys({
  value: Joi.boolean().required(),
}).options({allowUnknown: true});

module.exports = schema;
