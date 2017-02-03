"use strict";

const Joi = require("joi-browser");
const commonSchema = require("./commonSchema");

const testpilotEvent = Joi.object().keys({
  event: Joi.string().required(),
  object: Joi.string().required(),
  timestamp: Joi.number().integer().required()
});

const schema = commonSchema.keys({
  payload: Joi.object().required().keys({
    events: Joi.array().required().length(1).items(testpilotEvent),
    test: Joi.string().valid("@testpilot-addon").required(),
    timestamp: Joi.number().integer().required(),
    version: Joi.string().required()
  })
}).options({allowUnknown: true});

module.exports = schema;
