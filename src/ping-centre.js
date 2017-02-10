"use strict";

require("isomorphic-fetch");
const commonSchema = require("./schemas/commonSchema");
const Joi = require("joi-browser");
const uuid = require("uuid");
const config = require("./config");

class PingCentre {
  constructor(topic, clientID, pingEndpoint) {
    if (!topic) {
      throw new Error("Must specify topic.");
    }
    this._topic = topic;
    this._clientID = clientID || uuid();
    this._pingEndpoint = pingEndpoint || config.endpoint;

    const schema = require(`./schemas/${topic}`);
    this._schema = schema || commonSchema;
  }

  validate(payload) {
    return new Promise((resolve, reject) => {
      Joi.validate(payload, this._schema, (err, value) => {
        if (err) {
          reject(new Error(`Invalid payload ${JSON.stringify(value)}: ${err}.`));
        } else {
          resolve(value);
        }
      });
    });
  }

  sendPing(data, validate = true) {
    const payload = Object.assign({
      topic: this._topic,
      client_id: this._clientID
    }, data);

    let validatePromise = Promise.resolve();
    if (validate) {
      validatePromise = this.validate(payload);
    }

    return validatePromise.then(() => {
      return fetch(this._pingEndpoint, {method: "POST", body: payload}).then(response => {
        if (!response.ok) {
          throw new Error(`Ping failure with response code: ${response.status}`);
        } else {
          return response;
        }
      });
    }).catch(e => {
      console.error(e.message);
      throw e;
    });
  }
}
module.exports = PingCentre;
