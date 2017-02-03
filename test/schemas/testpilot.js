/* global expect */
"use strict";

const Joi = require("joi-browser");
const PingCentre = require("../../ping-centre");
const testPilotSchema = require("../../schemas/testpilot.js");

const samplePing = {
  type: "testpilot",
  id: "20076a92-360c-da4d-9742-8327848c5070",
  creationDate: "2016-11-30T22:46:57.230Z",
  version: 4,
  payload: {
    timestamp: 483,
    test: "@testpilot-addon",
    version: "0.9.1-dev-e42d9cb",
    events: [{
      timestamp: 483,
      event: "clicked",
      object: "txp_toolbar_menu_1"
    }]
  },
  clientId: "729e4a78-df2e-c347-ba29-18f34e5d5759",
  // To keep the sample ping reasonably small, I've replaced the deeply nested
  // application and environment properties with empty objects.
  application: {},
  environment: {},
  // These fields are in the common schema, and are normally added to the
  // ping by ping-centre. Adding them manually so the test ping will validate.
  topic: "testpilot",
  client_id: "729e4a78-df2e-c347-ba29-18f34e5d5759",
  event_type: "test"
};

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

describe("The 'testpilot' Schema", function() {
  it("is recognized by Ping Centre", function() {
    expect(() => { new PingCentre("testpilot"); }).to.not.throw();
  });
  it("should accept a valid testpilot ping", function(done) {
    // `err` will be passed to done, failing if truthy.
    Joi.validate(samplePing, testPilotSchema, done);
  });
  it("should reject if required field 'payload' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.payload;
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'payload' is empty", function(done) {
    const ping = clone(samplePing);
    ping.payload = {};
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'events' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.payload.events;
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'events' is empty", function(done) {
    const ping = clone(samplePing);
    ping.payload.events = [];
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'events' contains more than one event", function(done) {
    const ping = clone(samplePing);
    ping.payload.events.push(ping.payload.events[0]);
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'test' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.payload.test;
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'test' is malformed", function(done) {
    const ping = clone(samplePing);
    ping.payload.test = "invalid string";
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'timestamp' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.payload.timestamp;
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'timestamp' is a Date object", function(done) {
    const ping = clone(samplePing);
    ping.payload.timestamp = new Date();
    ping.payload.events[0].timestamp = new Date().toISOString();
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'timestamp' is a Date ISO string", function(done) {
    const ping = clone(samplePing);
    ping.payload.timestamp = new Date().toISOString();
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'version' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.payload.version;
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required field 'version' is malformed", function(done) {
    const ping = clone(samplePing);
    ping.payload.version = 12345; // version is an AMO version string, not an integer
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required event field 'event' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.payload.events[0].event;
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required event field 'event' is malformed", function(done) {
    const ping = clone(samplePing);
    ping.payload.events[0].event = 1;
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required event field 'object' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.payload.events[0].object;
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required event field 'object' is malformed", function(done) {
    const ping = clone(samplePing);
    ping.payload.events[0].object = 1;
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required event field 'timestamp' is missing", function(done) {
    const ping = clone(samplePing);
    delete ping.payload.events[0].timestamp;
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required event field 'timestamp' is a Date object", function(done) {
    const ping = clone(samplePing);
    ping.payload.events[0].timestamp = new Date();
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
  it("should reject if required event field 'timestamp' is a Date ISO string", function(done) {
    const ping = clone(samplePing);
    ping.payload.events[0].timestamp = new Date().toISOString();
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      done();
    });
  });
});
