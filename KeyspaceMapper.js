const cassandra = require('cassandra-driver')
const Mapper = cassandra.mapping.Mapper
const DefaultTableMappings = cassandra.mapping.DefaultTableMappings
const TableMapper = require('./TableMapper')

// my_keyspace_mapper = new KeyspaceMapper( client, keyspace )
// my_table = my_keyspace_mapper.forTable( my_table )
// return await my_table.insert( props )

class KeyspaceMapper {
  // determine the names of all of the tables in the specified keyspace
  // and create a mapper_model
  // TODO: handle failed queries with reject 
  constructor( client, keyspace ){
    this.mapper = new Promise( async (resolve, reject) => {
      let mapper_model = {models:{}}
      const mappings = new DefaultTableMappings
      const tables_query = 'SELECT * FROM system_schema.tables WHERE keyspace_name=?'
      const tables_list = await client.execute( tables_query, [keyspace], {prepare: true} )
      tables_list.rows.forEach( table => {
        mapper_model.models[table.table_name] = {tables: [table.table_name], keyspace, mappings}
      })
      return resolve( new Mapper(client, mapper_model) )
    })
  }

  forTable( tablename ){
      return new TableMapper( tablename, this.mapper )
  }
}

module.exports = KeyspaceMapper
