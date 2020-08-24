const camelcase = require('camelcase')

// pull some convenience functions into the module scope
const {restURL, gqlURL, keyspace} = require('./config')
const {camelcase_props, make_special_json, props_to_columns, props_to_params, get, post, client, mapper} = require('./utility')


// example:
// const users = new TableMultiAPI( 'users','Users' )
class TableMultiAPI {

  // Model names and table names are frequently the same but 
  // they are manually mapped as part of instantiating the mapper. 
  // The model naming convention is to uppercase the tablename as the model name
  // (see config.js and utility.js for the mapping in this app).  
  // Read complete documentation for the Node.js Mapper here:
  // https://docs.datastax.com/en/developer/nodejs-driver/5.5/features/mapper/
  constructor( tablename, modelname ){
    this.tablename = tablename
    this.modelmap = mapper.forModel( modelname )
  }
  

  /* ------------------------------------------------------------ */
  /* --------------------  CREATE FUNCTIONS  -------------------- */
  // Each of these functions creates one row in the table
  // Note that Cassandra is performing an "upsert" for all of the 
  // CREATE and UPDATE functions below.  
  
  // REST
  async rest_create( props ){
    return await post()( `${restURL}/v1/keyspaces/${keyspace}/tables/${this.tablename}/rows`,
                          { columns: props_to_columns( props ) })
  }
  
  // GraphQL
  async gql_create( props ){
    let prop_string = make_special_json( camelcase_props( props ))
    // the GraphQL API dynamically generates GraphQL 'mutations' and 'queries' in camelCase
    // based on the underlying table's name. E.g, for a 'user_blessings' table, 
    // mutations named insertUserBlessings(), updateUserBlessings(), and deleteUserBlessings();
    // queries named userBlessings() and userBlessingsFilter() will be generated
    let GqlModel = camelcase( this.tablename, {pascalCase: true} )

    // Example of the GraphQL query which will be generated:
    // Given this.tablename: "user_blessings"
    //   and props: {userid:'kiyuzg', year:2020, when:'2020-07-09 03:48:32', where_location:'Home Office', blessing:'Thankful for DataStax'}
    //
    //   mutation {
    //     insertUserBlessings( value: {userid:"kiyuzg", year:2020, when:"2020-07-09 03:48:32", whereLocation:"Home Office", blessing:"Thankful for DataStax"}  ){
    //     value { userid }}} 
    //
    // Some details which are, as of this writing, minor but significant:
    //      1. property names are not quoted (as they would be in JSON) 
    //      2. property names with underscores are converted to camelCase
    //      3. values are quoted with double quotes "" not single quotes ''.
    // The make_special_json() and camelcase_props() functions called above make these changes.
    // Hopefully, future versions of the GraphQL API may not have these requirements.
    return await post()( gqlURL,
                                  {query:
                                    `mutation {
                                      insert${GqlModel}( value: ${prop_string} ){
                                      applied }}`
                                  })
  }


  // CQL
  async cql_create( props ){
    const fields_string = Object.keys( props ).join( ", " )
    // we need the same number of "?" as there are K/V pairs; this should create "?,?,?,?" if there are four pairs
    const placeholders_string = Object.entries( props ).map((_) => "?").join(",")
    const query = `INSERT INTO ${this.tablename} (${fields_string}) VALUES (${placeholders_string})`
    return await client.execute( query, Object.values( props ), {prepare: true})
  }

  // CQL Mapper
  async cqlm_create( props ){
    return await this.modelmap.insert( props )
  }
  
  
  
  
  /* ------------------------------------------------------------ */
  /* --------------------  READ FUNCTIONS  -------------------- */
  // Each of these functions reads one row in the table
  // NOTE: I wanted to keep all of the method signatures the same between APIs 
  // but in the different requirements meant I had to deviate. 
  // REST requires that the primary keys are provided in the order they are defined and returns all availalbe columns
  // GraphQL wants named primary keys and requires specifying return fields
  // CQL Mapper wants named primary key fields but returned fields are optional
  
  // REST
  // @param Array primary_key
  // @param Array return_fields
  async rest_read( primary_key, return_fields = [] ){
    if( return_fields.length ) console.log('REST API does not currently support specifying return fields')
    let result = await get()( `${restURL}/v1/keyspaces/${keyspace}/tables/${this.tablename}/rows/${primary_key.join(';')}` )
    if( result && result.rows && result.rows.length ){
      return result.rows
    } else {
      return []
    }
  }
  
  // GraphQL
  // @param Object primary_key
  // @param Array, return_fields
  async gql_read( primary_key, return_fields = [] ){
    if (return_fields == []) throw new Error('GraphQL API requires specifying return fields')
    let prop_string = make_special_json( camelcase_props( primary_key ))
    let return_fields_string = return_fields.map(camelcase).join(' ')
    let gqlModel = camelcase( this.tablename )
    // Example of the GraphQL query which will be generated:
    // Given this.tablename: "user_blessings"
    //   and primary_key: {userid:'kiyuzg', year:2020, when:'2020-07-09 03:48:32'}
    //   and return_fields: ['userid', 'year', 'when', 'where_location', 'blessing']
    //
    //   query {
    //      userBlessings ( value: {userid:"kiyuzg", year:2020, when:"2020-07-09 03:48:32"}){
    //      values { userid year when whereLocation blessing }}}
    //
    //  In addition to the comments under gql_create(), note that return values
    //  are separated by spaces, which feels weird for me in JavaScript.
    let result = await post()( gqlURL,
                                {query:
                                  `query {
                                     ${gqlModel} ( value: ${prop_string} ){
                                     values { ${return_fields_string} }}}`
                                })
    if( result && result.data && result.data[gqlModel] && result.data[gqlModel].values && result.data[gqlModel].values.length ){
      return result.data[gqlModel].values
    } else {
      return []
    }
  }


  // CQL
  async cql_read( primary_key ){
    const query_params = props_to_params( primary_key )
    const query_string = Object.keys( query_params ).join( " AND " )
    const query = `SELECT * FROM ${this.tablename} WHERE ${query_string}` 
    return await client.execute( query, Object.values( query_params ), {prepare: true})
  }
  

  // CQL Mapper
  // @param Object primary_key
  // @param Array return_fields
  async cqlm_read( primary_key, return_fields = [] ){
    //console.log(`looking for: ${primary_key}`)
    let result = {}
    if( return_fields.length ){
      result = await this.modelmap.find(primary_key, {fields: return_fields})
    } else {
      result = await this.modelmap.find(primary_key)
    }
    return result.toArray()
  }
  
  
  
  /* ------------------------------------------------------------ */
  /* --------------------  UPDATE FUNCTIONS  -------------------- */
  // Each of these functions updates one row in the table
  // Note that CREATE and UPDATE functions all perform an "upsert"; 
  // although there are sytax differences, what is happening is the same.
  // The one exception is if you are using Lightweight Transactions
  
  // REST
  // NOTE: primary key values must be provided in the same order as they are 
  // defined in the underlying table.  The other 'update' functions don't 
  // need to specify the primary key separately but all primary key fields must be 
  // defined in props
  async rest_update( props ){
    return await post(true, 'POST')( `${restURL}/v1/keyspaces/${keyspace}/tables/${this.tablename}/rows`,
                          { columns: props_to_columns( props ) })
  }
  
  // GraphQL
  // NOTE: read comments under gql_create() and gql_read() for insights
  async gql_update( props, return_fields = [] ){
    if (return_fields == []) throw new Error('GraphQL API requires specifying return fields')
    let prop_string = make_special_json( camelcase_props( props ))
    let GqlModel = camelcase( this.tablename, {pascalCase: true} )
    let return_fields_string = return_fields.map(camelcase).join(' ')
    return await post()( gqlURL,
                                  {query:
                                    `mutation {
                                      update${GqlModel}( value: ${prop_string} ){
                                      value { ${return_fields_string} }}}`
                                  })
  }


  // CQL 
  async cql_update( props, primary_key ){
    const query_params = props_to_params( primary_key )
    const query_string = Object.keys( query_params ).join( " AND " )
    const update_params = props_to_params( props )
    const update_string = Object.keys( update_params ).join( ", " )
    const query = `UPDATE ${this.tablename} SET ${update_string} WHERE ${query_string}`
    return await client.execute( query, Object.values( query_params ).concat( Object.values(update_params)), {prepare: true})
  }

  
  // CQL Mapper
  async cqlm_update( props ){
    return await this.modelmap.update( props )
  }
  
  
  
  /* ------------------------------------------------------------ */
  /* --------------------  DELETE FUNCTIONS  -------------------- */
  // Each of these functions deletes one row in the table
  
  // REST
  // @param Array primary_key
  async rest_delete( primary_key ){
    return await post( true, "DELETE" )( `${restURL}/v1/keyspaces/${keyspace}/tables/${this.tablename}/rows/${primary_key.join(';')}` )
  }
  
  // GraphQL
  // @param Object primary_key
  // @param Array return_fields
  async gql_delete( primary_key ){
    let prop_string = make_special_json( camelcase_props( primary_key ))
    let GqlModel = camelcase( this.tablename, {pascalCase: true} )
    return await post()( gqlURL,
                                  {query:
                                    `mutation {
                                      delete${GqlModel}( value: ${prop_string} ){
                                      applied }}`
                                  })
  }


  // CQL
  async cql_delete( primary_key ){
    const query_params = props_to_params( primary_key )
    const query_string = Object.keys( query_params ).join( " AND " )
    const query = `DELETE FROM ${this.tablename} WHERE ${query_string}`
    return await client.execute(query, Object.values( query_params ), {prepare: true})
  }
  

  // CQL Mapper
  // @param Object primary_key
  async cqlm_delete( primary_key ){
    return await this.modelmap.remove( primary_key )
  }
}


module.exports = {
  TableMultiAPI
}
