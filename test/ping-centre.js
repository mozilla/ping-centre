"use strict";

const fetchMock = require('fetch-mock');
let PingCentre = require('../ping-centre');

const topic = "testpilot_server";
let pingClient = new PingCentre(topic);

describe('Ping Centre Throws', function() {
  it('throws if topic is empty', function() {
    assert.throws(() => new PingCentre("", "clientID"));
  });
});

describe('Joi Handles Various Cases', function() {
  it("rejects undefined data", function(done) {
    fetchMock.mock('*', {});
    let promise = pingClient.sendPing();
    promise.should.be.rejected.notify(done);
  });
  it("rejects if data is not an object", function(done) {
    fetchMock.mock('*', {});
    pingClient.sendPing(45).should.be.rejected.notify(done);
  });
  it("rejects if data is an empty object", function(done) {
    fetchMock.mock('*', {});
    pingClient.sendPing({}).should.be.rejected.notify(done);
  });
});

describe('Ping Centre Common Properties', function() {
  it('has the expected common properties', function(done) {
    fetchMock.mock('*', {});

    let event_type = "testpilot.test-install"
    pingClient.sendPing({
      event_type: event_type,
    }).then(result => {
      assert.equal(fetchMock.lastOptions("*").body.topic, topic, "topic exists in payload");
      assert.isNotNull(fetchMock.lastOptions("*").body.client_id, "client_id exists in payload");
      assert.equal(fetchMock.lastOptions("*").body.event_type, event_type, "event_type exists in payload");

      fetchMock.restore();
      done();
    });
  });
  it('does not throw when additional fields exist', function(done) {
    fetchMock.mock('*', {});
    pingClient = new PingCentre(topic, null, "http://www.test.com");
    pingClient.sendPing({
      event_type: "test",
      additional_field: "shouldn't throw"
    }).should.be.fulfilled.notify(done);
    fetchMock.restore();
  });
});
