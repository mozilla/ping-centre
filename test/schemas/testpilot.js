/* global expect */
"use strict";

const Joi = require("joi-browser");
const PingCentre = require("../../ping-centre");
const testPilotSchema = require("../../schemas/testpilot.js");

const samplePing = {
  topic: "testpilot",
  client_id: "729e4a78-df2e-c347-ba29-18f34e5d5759",
  event_type: "clicked",
  object: "txp_toolbar_menu_1",
  client_time: 483,
  firefox_version: "50.0.1",
  addon_id: "@testpilot-addon",
  addon_version: "0.9.4",
  os_name: "Darwin",
  os_version: "16.0.0",
  locale: "en-US",
  raw: JSON.stringify({
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
    environment: {}
  })
};

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

const requiredStrings = ["topic", "client_time", "firefox_version", "locale",
  "addon_id", "addon_version", "os_name", "os_version", "raw"];

describe("The 'testpilot' Schema", function() {
  it("is recognized by Ping Centre", function() {
    expect(() => { new PingCentre("testpilot"); }).to.not.throw();
  });
  it("should accept a valid testpilot ping", function(done) {
    // `err` will be passed to done, failing if truthy.
    Joi.validate(samplePing, testPilotSchema, done);
  });
  it("should reject if required field topic is incorrect", function(done) {
    const ping = clone(samplePing);
    ping.topic = "foo";
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      expect(err.details[0].path).to.equal("topic");
      expect(err.name).to.equal("ValidationError");
      done();
    });
  });
  requiredStrings.forEach((field) => {
    it(`should reject if required field ${field} is missing`, function(done) {
      const ping = clone(samplePing);
      delete ping[field];
      Joi.validate(ping, testPilotSchema, function(err) {
        expect(err).to.exist;
        expect(err.details[0].path).to.equal(field);
        expect(err.name).to.equal("ValidationError");
        done();
      });
    });
    it(`should reject if required field ${field} is empty`, function(done) {
      const ping = clone(samplePing);
      ping[field] = "";
      Joi.validate(ping, testPilotSchema, function(err) {
        expect(err).to.exist;
        expect(err.details[0].path).to.equal(field);
        expect(err.name).to.equal("ValidationError");
        done();
      });
    });
  });
  it("should reject if required field client_time is a Date object", function(done) {
    const ping = clone(samplePing);
    ping.client_time = new Date();
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
        expect(err.details[0].path).to.equal("client_time");
        expect(err.name).to.equal("ValidationError");
      done();
    });
  });
  it("should reject if required field client_time is a Date ISO string", function(done) {
    const ping = clone(samplePing);
    ping.client_time = new Date().toISOString();
    Joi.validate(ping, testPilotSchema, function(err) {
      expect(err).to.exist;
      expect(err.details[0].path).to.equal("client_time");
      expect(err.name).to.equal("ValidationError");
      done();
    });
  });
});
