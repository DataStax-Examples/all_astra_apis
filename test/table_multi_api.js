var expect = require('chai').expect
var {TableMultiAPI} = require('../table_multi_api')
const {gql_user, gql_devices, gql_activities, rest_user, rest_devices, rest_activities,
cql_user, cql_devices, cql_activities, cqlm_user, cqlm_devices, cqlm_activities} = require('./sample_data')


let users = new TableMultiAPI( 'users', 'users' )
let user_devices = new TableMultiAPI('user_devices', 'user_devices')
let usage_log = new TableMultiAPI('usage_log', 'usage_log')


// GRAPHQL FUNCTIONS
describe('GraphQL user CRUD functions', function(){
    this.timeout( 10000 )
    describe('#gql_create()', function(){
        it('should create a user through the GraphQL API', async function(){
            const result = await users.gql_create( gql_user )
            expect( result ).to.have.property('data')
            expect( result.data.insertUsers.applied ).to.be.true

        })

        it('should create a user_device through the GraphQL API', async function(){
            const result = await user_devices.gql_create( gql_devices[0] )
            expect( result ).to.have.property('data')
            expect( result.data.insertUserDevices.applied ).to.be.true })
    })


    describe('#gql_read()', function(){
        it('should read the previously created user through the GraphQL API', async function(){
            const result = await users.gql_read( {user_id: gql_user.user_id}, ['user_id','name','email'] )
            expect( result[0] ).to.have.property( "email", gql_user.email ) })

        it('should read the previously created user_device through the GraphQL API', async function(){
            const result = await user_devices.gql_read( {user_id: gql_devices[0].user_id, device_name: gql_devices[0].device_name}, ['user_id', 'device_name', 'description', 'device_location', 'last_used', 'most_recent_device'] )
            expect( result[0] ).to.have.property( "deviceLocation", gql_devices[0].device_location ) })

    })


    describe('#gql_update()', function(){
        it('should update the previously created user through the GraphQL API', async function(){
            const result = await users.gql_update( { ...gql_user, city:"Houston, TX" }, ['user_id'] )
            expect( result.data.updateUsers.value ).to.have.property( "userId", gql_user.user_id ) })

        it('should update the previously created user_device through the GraphQL API', async function(){
            const result = await user_devices.gql_update( { ...gql_devices[0], device_location:"30.130881, -95.472073" }, ['user_id'] )
            expect( result.data.updateUserDevices.value ).to.have.property( "userId", gql_devices[0].user_id ) })
    })


    describe('#gql_delete()', function(){
        it('should delete the previously created user through the GraphQL API', async function(){
            const result = await users.gql_delete( {user_id:gql_user.user_id} )
            expect( result.data.deleteUsers.applied ).to.be.true })

        it('should delete the previously created user_device through the GraphQL API', async function(){
            const result = await user_devices.gql_delete({user_id: gql_devices[0].user_id, device_name: gql_devices[0].device_name} )
            expect( result.data.deleteUserDevices.applied ).to.be.true })
    })
})


// REST FUNCTIONS
describe('REST user CRUD functions', function(){
    this.timeout( 10000 )
    describe('#rest_create()', function(){
        it('should create a user through REST API', async function(){
            const result = await users.rest_create( rest_user )
            expect( result ).to.have.property('success', true) })

        it('should create a user_device through REST API', async function(){
            const result = await user_devices.rest_create( rest_devices[0] )
            expect( result ).to.have.property('success', true) })
    })


    describe('#rest_read()', function(){
        it('should read a user through the REST API', async function(){
            const result = await users.rest_read( [rest_user.user_id] )
            expect( result[0] ).to.have.property( "email", rest_user.email ) })

        it('should read a user_device through the REST API', async function(){
            const result = await user_devices.rest_read( [rest_devices[0].user_id, rest_devices[0].device_name] )
            expect( result[0] ).to.have.property( "device_location", rest_devices[0].device_location ) })
    })


    describe('#rest_update()', function(){
        it('should update a user through the REST API', async function(){
            const result = await users.rest_update({ user_id:rest_user.user_id, city:"Dallas, TX" } )
            expect( result ).to.have.property( "success", true ) })

        it('should update a user_device through the REST API', async function(){
            const result = await user_devices.rest_update({ user_id:rest_devices[0].user_id, device_name:rest_devices[0].device_name, device_location:"35.130881, -95.472064" } )
            expect( result ).to.have.property( "success", true ) })
    })


    describe('#rest_delete()', function(){
        it('should delete a user through the REST API', async function(){
            const result = await users.rest_delete( [rest_user.user_id] )
            expect( result ).to.have.property( "statusCode", 204 ) })

        it('should delete a user_device through the REST API', async function(){
            const result = await user_devices.rest_delete( [rest_devices[0].user_id, rest_devices[0].device_name] )
            expect( result ).to.have.property( "statusCode", 204 ) })
    })
})


// CQL FUNCTIONS
describe('CQL user CRUD functions', function(){
    this.timeout( 5000 )
    describe('#cql_create()', function(){
        it('should create a user through CQL API', async function(){
            const result = await users.cql_create( cql_user )
            expect( result.wasApplied() ).to.be.true })

        it('should create a user_device through CQL API', async function(){
            const result = await user_devices.cql_create( cql_devices[0] )
            expect( result.wasApplied() ).to.be.true })
    })

    describe('#cql_read()', function(){
        it('should read a user through the CQL API', async function(){
            const result = await users.cql_read( {user_id: cql_user.user_id} )
            expect( result.rows ).to.have.property('length') })

        it('should read a user_device through the CQL API', async function(){
            const result = await user_devices.cql_read( {user_id: cql_devices[0].user_id, device_name: cql_devices[0].device_name } )
            expect( result.rows ).to.have.property('length') })
    })

    describe('#cql_update()', function(){
        it('should update a user through the CQL API', async function(){
            const result = await users.cql_update( {city:"New York City, NY" }, {user_id: cql_user.user_id} )
            expect( result.wasApplied() ).to.be.true })

        it('should update a user_device through the CQL API', async function(){
            const result = await user_devices.cql_update( { device_location:"35.130881, -95.472064" }, {user_id: cql_devices[0].user_id, device_name: cql_devices[0].device_name })
            expect( result.wasApplied() ).to.be.true })
    })

    describe('#cql_delete()', function(){
        it('should delete a user through the CQL API', async function(){
            const result = await users.cql_delete( {user_id: cql_user.user_id} )
            expect( result.wasApplied() ).to.be.true })

        it('should delete a user_device through the CQL API', async function(){
            const result = await user_devices.cql_delete( {user_id: cql_devices[0].user_id, device_name: cql_devices[0].device_name } )
            expect( result.wasApplied() ).to.be.true })
    })
})

// CQL MAPPER FUNCTIONS
describe('CQL Mapper user CRUD functions', function(){
    this.timeout( 5000 )
    describe('#cqlm_create()', function(){
        it('should create a user through CQL Mapper API', async function(){
            const result = await users.cqlm_create( cqlm_user )
            expect( result ).to.have.property('length') }) // need a better success test but I'm not sure what property to watch for other than just not throwing an exception

        it('should create a user_device through CQL Mapper API', async function(){
            const result = await user_devices.cqlm_create( cqlm_devices[0] )
            expect( result ).to.have.property('length') }) // need a better success test but I'm not sure what property to watch for other than just not throwing an exception
    })

    describe('#cqlm_read()', function(){
        it('should read a user through the CQL Mapper API', async function(){
            const result = await users.cqlm_read( {user_id: cqlm_user.user_id} )
            expect( result ).to.have.property('length') })

        it('should read a user_device through the CQL Mapper API', async function(){
            const result = await user_devices.cqlm_read( {user_id: cqlm_devices[0].user_id, device_name: cqlm_devices[0].device_name } )
            expect( result ).to.have.property('length') })
    })

    describe('#cqlm_update()', function(){
        it('should update a user through the CQL Mapper API', async function(){
            const result = await users.cqlm_update( { ...cqlm_user, city:"New York City, NY" } )
            expect( result ).to.have.property('length') })

        it('should update a user_device through the CQL Mapper API', async function(){
            const result = await user_devices.cqlm_update( { ...cqlm_devices[0], device_location:"35.130881, -95.472064" } )
            expect( result ).to.have.property('length') })
    })

    describe('#cqlm_delete()', function(){
        it('should delete a user through the CQL Mapper API', async function(){
            const result = await users.cqlm_delete( {user_id: cqlm_user.user_id} )
            expect( result ).to.have.property('length') })

        it('should delete a user_device through the CQL Mapper API', async function(){
            const result = await user_devices.cqlm_delete( {user_id: cqlm_devices[0].user_id, device_name: cqlm_devices[0].device_name } )
            expect( result ).to.have.property('length') })
    })
})


