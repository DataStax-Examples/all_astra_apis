# Demonstrate All Astra APIs
Data in the Astra DBaaS can be accessed using four different APIs (so far).  
* GraphQL API
* REST API
* Cassandra Query Language (CQL) API
* Mapper API

This reference project shows how you can use these APIs from Node.js.


## Project Layout
The most files are in the root of the project:
* table_multi_api.js: examples of CRUD operations using each API
* schema.cql: example Cassandra schema that works with the tests
* config.js: your settings
* utility.js: functions to deal with some of the differences in the way the APIs like their data
* KeyspaceMapper.js: class that wraps the regular Node.js driver Mapper functionality to create one model per table in the keyspace
* TableMapper.js: support file for KeyspaceMapper.js

There are also test files to illustrate how the examples could be used:
* test/multi_table_api.js: test the functionality of the table_multi_api.js
* test/KeyspaceMapper.js: test the functionality of the KeyspaceMapper
* test/sample_data.js: sample data for table_multi_api.js 


## Setup and Running
If you'd like to see the tests in action, you'll need a test database.
1. Create an account at [astra.datastax.com](https://astra.datastax.com)
2. Set up a database (in the samples, I named the database "stuff")
3. Set up a keyspace (in the samples, I also named the keyspace "stuff")
4. Set up a user and password (in the samples, I used "stuff_user" and "stuff_password" - you should use something more secure)
5. Put all of this information into your config.js
6. Download the secure connect bundle from the summary page after your database has launched.  You'll need this later. Save this file in the root of this project and update the config.js file with the path to it.
7. Also grab the REST API URL from the Summary page - put basE of this URL in the config.js.  The base of the REST API URL and the GraphQL API URL are the same, just trim off the "/api/rest" part.  
8. Use the CQL Console to create the tables defined in the schema.cql file
9. In the root of this project, run `npm test` to exercise all the APIs.  

### Prerequisites
* This requires a recent version of Node.js; I was using v14.7
* You'll also need an Astra database (can be set up for free)

Contributors: [Kiyu Gabriel](https://github.com/qzg)
