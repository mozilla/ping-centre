"use strict";

class PingCentre {
  constructor(apiKey, clientID) {
    if (!apiKey) {
      throw new Error("Must specify API key.");
    }
    this._clientID = clientID;
    this._apiKey = apiKey;
  }

  sendPing(data) {
    if (typeof data !== 'object') {
      throw new Error(`Expecting object got ${typeof data}`);
    }
    if (!data || Object.keys(data).length === 0) {
      throw new Error(`Empty data object`);
    }

    console.log("Sending ping to Onyx");

    // TODO: Send ping to onyx.
    // fetch(this._pingEndpoint, {method: "POST", body: data})
  }
}
module.exports = PingCentre;