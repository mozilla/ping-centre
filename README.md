# ping-centre

A client for easily collecting events and metrics.

# Install
```sh
$ npm install ping-centre
```

# Usage

```js
const PingCentre = require("ping-centre");

// create a ping-centre object
const pc = new PingCentre("some_topic_foo", "some_cient_id_123");

// create the payload
const payload = makePayload();

// send the payload asynchronously
pc.sendPing(payload);

// validate the payload asynchronously
pc.validate(payload);
```

When testing your app with Ping Centre, your data will be sent to a staging server by default.
To send your data to a production server, set the `NODE_ENV` environment variable to `production`.

# Overview

Ping-centre consists of three main parts: the clients, the data pipeline, and the dashboard.

The clients are responsible for collecting the events and forwarding
them to [Onyx][Onyx Homepage] - the entrance of the data pipeline. Besides Onyx, the
data pipeline employes a [Disco][Disco Homepage] cluster to run the ETL jobs, which
in turn persist the outcome to AWS Redshift. Through [re:dash dashboard][Re:dash Dashboard],
the user can access the data warehouse, slice and dice the datasets via SQL queries.

Behind the scenes, a ping-centre client is simply a wrapper around the HTTP POST request.
Therefore, it could be implemented in any programming language. And this repo implements
it in Javascript.

## Topics

As ease-of-use is the primary goal of the client, the client user does *not* need to
specify the telemetry destination, i.e. the endpoint of the Onyx. Instead, the user
just specifies the topic of the payload. In fact, Onyx merely exposes a single endpoint and
multiplexes all the topics onto that endpoint. The ETL task runner [Infernyx][Infernyx Homepage]
will demultiplex the inputs and process each topic separately.

## Schemas

For each topic, the user is going to provide a schema to describe the associated payload.
As the reference of table schema in Redshift, this schema could also be used by the
ETL jobs to conduct the data extraction, cleaning, and transforming.


We use [joi-browser][Joi-browser Homepage] to define the schemas for the Javascript client. By convention, all
schemas are saved in the `schemas` directory with the same name of the topics. In each schema,
the user specifies following attributes in the schema for each topic:

* Field name
* Field modifiers
  - type
  - required or optional
  - length if applicable
  - enum values, e.g. ['click', 'search', 'delete']
  - see [Joi][Joi Homepage] for more details
* Other ETL requirements are attached as comments if applicable

Here is an example:

```js
const Joi = require("joi-browser");

const schema = Joi.object().keys({
    // a required string field with no more than 128 characters
    client_id: Joi.string().max(128).required(),
    // a required javascript timestamp with milliseconds
    received_at: Joi.date().timestamp().required(),
    // an required enum string field
    event: Joi.any().valid(['add', 'delete', 'search']).required(),
    // an optional positive integer field
    value: Joi.number().integer().positive().optional(),
}).options({allowUnknown: true});  // allow other non-specified fields

/*
 * ETL processing
 *
 * 1. Truncate the milliseconds of the 'received_at', e.g. 147743323232 -> 147743323
 * 2. Rename the 'value' field to 'latency' in the database
 * 3. Capitalize the 'event' field
 */

module.exports = schema;
```

[Onyx Homepage]: https://github.com/mozilla/onyx
[Disco Homepage]: http://discoproject.org/
[Re:dash Dashboard]: https://sql.telemetry.mozilla.org/
[Infernyx Homepage]: https://github.com/tspurway/infernyx
[Joi Homepage]: https://github.com/hapijs/joi
[Joi-browser Homepage]: https://github.com/jeffbski/joi-browser
