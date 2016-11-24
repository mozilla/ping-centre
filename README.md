# ping-centre

A client for easily collecting events and metrics.

# Install
```sh
$ npm install ping-centre --save
```

# Usage

```js
const pc = require("ping-centre");

// create the payload
const payload = makePayload();

// send the payload asynchronously
// the first argument is the top name, see more details below
pc.send("SOME-TOPIC-NAME", payload);
```

# Overview

Ping-centre consists of 3 major parts: the clients, the data pipeline, and the dashboard.

The clients are responsible for collecting the events and forwarding
them to [Onyx][Onyx Homepage] - the entrance of the data pipeline. Besides Onyx, the
data pipeline employes a [Disco][Disco Homepage] cluster to run the ETL jobs, which
in turn persist the outcome to AWS Redshift. Through [re:dash dashboard][Re:dash Dashboard],
the user can access the data warehouse, slice and dice the datasets via SQL queries.

Behind the scene, a ping-centre client is simply a wrapper around the HTTP POST request.
Therefore, it could be implemented in any programming language. And this repo implements
it in Javascript.

## Topics

As ease-of-use is the primary goal of the client's design, the user does *not* need to
specify the telemetry destination, i.e. the endpoint of the Onyx. Instread, the user
just specifies the topic of the payload. In fact, Onyx just exposes a single endpoint and
multiplexes all the topics onto the same data pipeline. The ETL task runner [Infernyx][Infernyx Homepage]
will demultiplex the inputs and process each topic separately.

## Schemas

For each topic, the user needs to provide a schema to describe the payload of the topic.
This schema then would be used as the reference of table schema in Redshift. It'd also be used by the
ETL jobs to conduct the data cleaning and processing.

By convention, this schema should be of the same name as the topic, then it should be saved in the `schemas`
directory in this repo. We don't require any mandatory format for the schema, however, JSON is
the preferred one as it could be easier to use for the data validation afterwards. 

The user should specify following specs for the topic in the schema:

* Field name
* Field modifiers
  - type
  - required or optional
  - length if applicable, e.g. VARCHAR(24)
  - enum values, e.g. ['click', 'search', 'delete']
* Other ETL requirements if applicable

A schema example:

```
{
    "event": "Required, String(32), Enum of ['click', 'delete', 'search']",
    "client_id": "Required, String(64)",
    "duration": "Optional, Int",
    ...
    "source": "Optional, String(32)"
}

// ETL specs
Note:
    1. Set "duration" to -1 if its value is greater than 1000
    2. Remove all the pings with event as "n/a"
```

## Data validation

The clients also comes with various utility functions to validate payloads.

#TODO: augment this section once we have a clear plan

Refers to [joi][Joi Homepage]???


[Onyx Homepage]: https://github.com/mozilla/onyx
[Disco Homepage]: http://discoproject.org/
[Re:dash Dashboard]: https://sql.telemetry.mozilla.org/
[Infernyx Homepage]: https://github.com/tspurway/infernyx
[Joi Homepage]: https://github.com/hapijs/joi
