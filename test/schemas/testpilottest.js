/* global expect */
"use strict";

const Joi = require("joi-browser");
const PingCentre = require("../../ping-centre");
const schema = require("../../schemas/testpilottest.js");

const samplePing = {
  timestamp: 4321,
  test: "test-experiment@mozilla",
  version: "1.2.3-beta",
  variants: {
    pageWidthTest: "extraWidth",
    redButtonTest: false
  },
  payload: {
    things: "stuff"
  },
  // These fields are in the common schema, and are normally added to the
  // ping by ping-centre. Adding them manually so the test ping will validate.
  topic: "testpilottest",
  client_id: "729e4a78-df2e-c347-ba29-18f34e5d5759",
  event_type: "test"
};

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

describe("The 'testpilottest' Schema", function() {
  it("is recognized by Ping Centre", function() {
    expect(() => { new PingCentre("testpilottest"); }).to.not.throw();
  });
  it("should accept a valid testpilottest ping", function(done) {
    // `err` will be passed to done, failing if truthy.
    Joi.validate(samplePing, schema, done);
  });
  it("should reject if required field 'timestamp' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.timestamp;
    Joi.validate(ping, schema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'timestamp' is a Date object", function(done) {
    const ping = clone(samplePing);
    ping.timestamp = new Date();
    Joi.validate(ping, schema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'timestamp' is a string", function(done) {
    const ping = clone(samplePing);
    ping.timestamp = new Date().toISOString();
    Joi.validate(ping, schema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'test' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.test;
    Joi.validate(ping, schema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'version' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.version;
    Joi.validate(ping, schema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should accept if required field 'variants' is null", function(done) {
    const ping = clone(samplePing);
    ping.variants = null;
    // `err` will be passed to done, failing if truthy.
    Joi.validate(ping, schema, done);
  });
  it("should reject if required field 'variants' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.variants;
    Joi.validate(ping, schema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'payload' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.payload;
    Joi.validate(ping, schema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'payload' is an empty object", function(done) {
    const ping = clone(samplePing);
    ping.payload = {};
    Joi.validate(ping, schema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
});
