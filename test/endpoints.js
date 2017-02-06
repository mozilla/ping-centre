/* global assert */
"use strict";

const topic = "sample";

describe("Ping Centre Endpoints", function() {
  it("default endpoint is used by default", function() {
    const PingCentre = require("../ping-centre");
    const pingClient = new PingCentre(topic);
    assert.equal(pingClient._pingEndpoint, "https://onyx_tiles.stage.mozaws.net/v3/links/ping-centre");
  });

  it("prod endpoint is used when prod environment variable is set", function() {
    // Clear cache for ping-centre and config since ping-centre needs to be
    // required again in order to require config again and look up the
    // newly set environment variables.
    delete require.cache[require.resolve("../ping-centre")];
    delete require.cache[require.resolve("../config")];

    process.env["NODE_ENV"] = "production";
    const PingCentre = require("../ping-centre");
    const pingClient = new PingCentre(topic);
    assert.equal(pingClient._pingEndpoint, "https://tiles.services.mozilla.com/v3/links/ping-centre");
  });
});
