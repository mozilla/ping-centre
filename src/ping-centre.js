/*global platform_require*/
"use strict";

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

    this._setGlobalFetch();
  }

  _setGlobalFetch() {
    if (typeof platform_require !== "undefined") {
      // If we're in Firefox Addon land, import fetch this way.
      platform_require("chrome").Cu.importGlobalProperties(["fetch"]);
      return;
    }
    require("isomorphic-fetch");
  }

  sendPing(data) {
    if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
      throw new Error("Malformed or empty data object");
    }

    const payload = Object.assign({
      topic: this._topic,
      client_id: this._clientID
    }, data);

    return fetch(this._pingEndpoint, {method: "POST", body: JSON.stringify(payload)}).then(response => {
      if (!response.ok) {
        throw new Error(`Ping failure with response code: ${response.status}`);
      } else {
        return response;
      }
    }).catch(e => {
      console.error(e.message);
      throw e;
    });
  }
}
module.exports = PingCentre;
