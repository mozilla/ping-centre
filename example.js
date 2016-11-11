"use strict";

/**
 * In an add-on you can get the UT client ID like this:
 *
 * Task.spawn(function*() {
 *   const {Cu} = require("chrome");
 *   Cu.import("resource://gre/modules/ClientID.jsm");
 *   const myClientID = yield ClientID.getClientID();
 * });
 */

const apiKey = process.env.PING_CENTRE_KEY;
const PingCentre = require('ping-centre');
const pingClient = new PingCentre(apiKey, "clientID");

pingClient.sendPing({
  type: "search",
  value: 3
});
