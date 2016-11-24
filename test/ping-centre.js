"use strict";

const fetchMock = require('fetch-mock');
const assert = require("chai").assert;
let PingCentre = require('../ping-centre');

const topic = "testpilot_server";
const pingClient = new PingCentre(topic);

describe('Ping Centre Throws', function() {
  it('throws if topic is is empty', function() {
    assert.throws(() => new PingCentre("", "clientID"));
  });
  it('throws if data is undefined', function() {
    assert.throws(() => pingClient.sendPing());
  });
  it('throws if data is not an object', function() {
    assert.throws(() => pingClient.sendPing(45));
  });
  it('throws if data is an empty object', function() {
    assert.throws(() => pingClient.sendPing({}));
  });
});

describe('Ping Centre Common Properties', function() {
  it('has the expected common properties', function() {
    fetchMock.mock('*', {});

    let event_type = "testpilot.test-install"
    pingClient.sendPing({
      event_type: event_type,
    });

    assert.equal(fetchMock.lastOptions("*").body.topic, topic, "topic exists in payload");
    assert.isNotNull(fetchMock.lastOptions("*").body.client_id, "client_id exists in payload");
    assert.equal(fetchMock.lastOptions("*").body.event_type, event_type, "event_type exists in payload");

    fetchMock.restore();
  });
  it('does not throw when additional fields exist', function() {
    fetchMock.mock('*', {});

    assert.doesNotThrow(() => {
      return pingClient.sendPing({
        event_type: "test",
        additional_field: "shouldn't throw"
      });
    });

    fetchMock.restore();
  });
});