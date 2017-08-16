/* global assert */
"use strict";

const Joi = require("joi-browser");
const fetchMock = require("fetch-mock");
const PingCentre = require("../../src/ping-centre");
const commonSchema = require("../../src/schemas/commonSchema.js");

const topic = "sample";
let pingClient = new PingCentre(topic);

before(() => {
  fetchMock.mock("*", {});
});

after(() => {
  fetchMock.restore();
});

describe("Ping Centre Throws", function() {
  it("throws if topic is empty", function() {
    assert.throws(() => new PingCentre("", "clientID"));
  });
});

describe("Handling malformed data", function() {
  it("rejects undefined data", function(done) {
    assert.throws(() => pingClient.sendPing());
    done();
  });
  it("rejects if data is not an object", function(done) {
    assert.throws(() => pingClient.sendPing(45));
    done();
  });
  it("rejects if data is an empty object", function(done) {
    assert.throws(() => pingClient.sendPing({}));
    done();
  });
});

describe("Ping Centre Common Properties", function() {
  it("has the expected common properties", function(done) {
    const event_type = "testpilot.test-install";
    pingClient.sendPing({
      event_type: event_type,
      value: true,
    }).then(result => {
      Joi.validate(JSON.parse(fetchMock.lastOptions("*").body), commonSchema);
      done();
    });
  });
  it("does not throw when additional fields exist", function(done) {
    pingClient = new PingCentre(topic, null, "http://www.test.com");
    pingClient.sendPing({
      event_type: "test",
      value: true,
      additional_field: "shouldn't throw"
    }).should.be.fulfilled.notify(done);
  });
});

describe("Setting Global Fetch", function() {
  it("uses isomorphic fetch by default", function() {
    assert.equal(typeof platform_require, "undefined", "platform_require is not defined by default");
    assert.equal(typeof fetch, "function");
  });
  it("when platform_require is defined, we don't use isomorphic fetch", function() {
    const tmp = global.fetch;
    global.platform_require = function() {
      return {Cu: {
        importGlobalProperties: function() {
          global.fetch = {};
        }}
      };
    };
    pingClient = new PingCentre(topic);
    assert.equal(typeof platform_require, "function", "platform_require is now set");
    assert.equal(typeof fetch, "object");
    global.fetch = tmp;
  });
});

describe("Ping Centre Handles Server Errors", function() {
  it("handles 400 error", function(done) {
    fetchMock.restore();
    fetchMock.mock("*", 400);
    pingClient.sendPing({
      event_type: "test",
      value: true,
      additional_field: "should reject"
    }).should.be.rejected.notify(done);
  });
});
