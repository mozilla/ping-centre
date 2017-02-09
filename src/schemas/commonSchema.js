"use strict";

const Joi = require("joi-browser");

const schema = Joi.object().keys({
  client_id: Joi.string().required(),
  topic: Joi.string().required(),
  event_type: Joi.string().required(),
}).options({allowUnknown: true});

module.exports = schema;
