const cassandra = require('cassandra-driver')
const ModelMapper = cassandra.mapping.ModelMapper

class TableMapper {

  constructor( tablename, mapper_promise ){
    this.mapped_model = mapper_promise.then(
      mapper => mapper.forModel( tablename ))
  }

  wrapped_call(method, args){
    return this.mapped_model.then(
      (mm) => mm[method].apply( mm, args ))
  }

  // wrap the supporting instance methods with a promise to wait 
  // for the KeyspaceMapper#build_model method to complete successfully
  get(){          return this.wrapped_call( "get", arguments ) }
  find(){         return this.wrapped_call( "find", arguments ) }
  findAll(){      return this.wrapped_call( "findAll", arguments ) }
  insert(){       return this.wrapped_call( "insert", arguments ) }
  update(){       return this.wrapped_call( "update", arguments ) }
  remove(){       return this.wrapped_call( "remove", arguments ) }
  mapWithQuery(){ return this.wrapped_call( "mapWithQuery", arguments ) }
}

module.exports = TableMapper
