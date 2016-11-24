"use strict";

require('isomorphic-fetch');
const commonSchema = require('./schemas/commonSchema');
const Joi = require('joi');
const uuid = require('uuid');

const PING_ENDPOINT = "";

class PingCentre {
  constructor(topic, clientID, pingEndpoint, schema) {
    if (!topic) {
      throw new Error("Must specify topic.");
    }
    this._topic = topic
    this._clientID = clientID || uuid();
    this._schema = schema || commonSchema;
    this._pingEndpoint = pingEndpoint || PING_ENDPOINT;
  }

  sendPing(data) {
    let payload = Object.assign({
      topic: this._topic,
      client_id: this._clientID
    }, data);

    Joi.validate(payload, this._schema, function (err, value) {
      if (err) {
        throw new Error(`Invalid object schema ${JSON.stringify(value)}: ${err}.`);
      }
    });

    return fetch(this._pingEndpoint, {method: "POST", body: payload}).then(response => {
      if (!response.ok) {
        console.error(`Ping failure with response code: ${response.status}`);
      }

    }).catch(e => {
      console.error(`Ping failure with error code: ${e.message}`);
    });
  }
}
module.exports = PingCentre;