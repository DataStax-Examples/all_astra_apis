
All Astra APIs tutorial:

[![Tutorial](https://user-images.githubusercontent.com/69874632/95135245-f66ed400-0718-11eb-9549-fb8624585629.png)](https://www.youtube.com/watch?v=r8JQZvO-n9A "Tutorial")

# Demonstrate All Astra APIs
Data in the Astra DBaaS can be accessed using four different APIs (so far).  
* GraphQL API
* REST API
* Cassandra Query Language (CQL) API
* Mapper API

This reference project shows how you can use these APIs from Node.js.

Contributors: [Kiyu Gabriel](https://github.com/qzg)

## Project Layout
The most files are in the root of the project:
* [table_multi_api.js](table_multi_api.js): examples of CRUD operations using each API
* [schema.cql](schema.cql): example Cassandra schema that works with the tests
* [config.js](config.js): your settings
* [utility.js](utility.js): functions to deal with some of the differences in the way the APIs like their data
* [KeyspaceMapper.js](KeyspaceMapper.js): class that wraps the regular Node.js driver Mapper functionality to create one model per table in the keyspace
* [TableMapper.js](TableMapper.js): support file for KeyspaceMapper.js

There are also test files to illustrate how the examples could be used:
* [test/multi_table_api.js](test/multi_table_api.js): test the functionality of the table_multi_api.js
* [test/KeyspaceMapper.js](test/KeyspaceMapper.js): test the functionality of the KeyspaceMapper
* [test/sample_data.js]([test/sample_data.js]): sample data for table_multi_api.js 

## Setup and Running

### Prerequisites
* This requires a recent version of Node.js; I was using v14.7
* You will need to install [Mocha](https://mochajs.org/) `npm install mocha`
* You'll also need an Astra database (can be set up for free)

### Running
If you'd like to see the tests in action, you'll need a test database.
1. Create a free-forever Cassandra Database with DataStax Astra: [click here to get started](https://astra.datastax.com/register?utm_source=github&utm_medium=referral&utm_campaign=spring-data-starter) 🚀
![90944037-75aa8180-e3d1-11ea-9b17-91929d55bc07](https://user-images.githubusercontent.com/69874632/91213849-11383c80-e6c7-11ea-8e75-f58646502971.png)
2. Set up a database, keyspace, username and password (in the samples, I named the database and keyspace "stuff", username "stuff_user" and password "stuff_password")
3. Put all of this information into your `config.js`
4. Download the secure connect bundle from the summary page after your database has launched.  You'll need this later. Save this file update the `config.js` file with the path to it.
5. Also grab the REST API URL from the Summary page - put base of this URL in the config.js.  The base of the REST API URL and the GraphQL API URL are the same, just trim off the "/api/rest" part.  
6. Use the CQL Console to create the tables defined in the `schema.cql` file
7. In the root of this project, run `npm test` to exercise all the APIs.  


