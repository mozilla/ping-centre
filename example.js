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

const topic = process.env.PING_CENTRE_TOPIC;
const PingCentre = require('ping-centre');
const pingClient = new PingCentre(topic, "clientID", "https://onyx_tiles.stage.mozaws.net/v3/links/activity-stream");

pingClient.sendPing({
  event_type: "search",
  value: 3
});
