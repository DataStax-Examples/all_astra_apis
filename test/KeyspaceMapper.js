const expect = require('chai').expect
const {username, password, secure_bundle_path } = require('../config')
const cassandra = require('cassandra-driver')
const Client = cassandra.Client
const client = new Client({ cloud:{ secureConnectBundle:secure_bundle_path},
                            credentials: {username, password},
                            keyspace:'stuff'})

const KeyspaceMapper = require('../KeyspaceMapper')
const stuff_mapper = new KeyspaceMapper( client, 'stuff' )
const users = stuff_mapper.forTable('users')

// sample data
const dt = (new Date()).toISOString()
const new_user = {user_id:"cql-special-user", name:"cql User Ninety-Nine", city:"Austin, TX", email:"cql@example.com", member_since:dt, last_login:dt }

describe('KeyspaceMapper functionality', function(){
  this.timeout(10000)
  describe('TableMapper functions', function(){
    it('should create a user through the mapped API', async function(){
      const result = await users.insert( new_user )
      expect( result.wasApplied() ).to.be.true
    })

    it('should update a user through the mapped API', async function(){
      const result = await users.update({...new_user, city:"Houston,TX"})
      expect( result.wasApplied() ).to.be.true
    })

    it('should read a user through the mapped API', async function(){
      const result = await users.find({user_id:new_user.user_id})
      expect( result.toArray() ).to.be.an('array').that.is.not.empty
    })

    it('should delete a user through the mapped API', async function(){
      const result = await users.remove({user_id:new_user.user_id})
      expect( result.wasApplied() ).to.be.true
    })
  })
})
