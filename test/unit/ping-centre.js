/* global assert */
"use strict";

const fetchMock = require("fetch-mock");
const PingCentre = require("../../src/ping-centre");

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

describe("Joi Handles Various Cases", function() {
  it("rejects undefined data", function(done) {
    const promise = pingClient.sendPing();
    promise.should.be.rejected.notify(done);
  });
  it("rejects if data is not an object", function(done) {
    pingClient.sendPing(45).should.be.rejected.notify(done);
  });
  it("rejects if data is an empty object", function(done) {
    pingClient.sendPing({}).should.be.rejected.notify(done);
  });
});

describe("Ping Centre Common Properties", function() {
  it("has the expected common properties", function(done) {
    const event_type = "testpilot.test-install";
    pingClient.sendPing({
      event_type: event_type,
      value: true,
    }).then(result => {
      assert.equal(fetchMock.lastOptions("*").body.topic, topic, "topic exists in payload");
      assert.isNotNull(fetchMock.lastOptions("*").body.client_id, "client_id exists in payload");
      assert.equal(fetchMock.lastOptions("*").body.event_type, event_type, "event_type exists in payload");
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

describe("Validation handling", function() {
  it("Invalid data is passed when validation is turned off", function(done) {
    pingClient.sendPing({}, false).should.be.fulfilled.notify(done);
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
