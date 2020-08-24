// SAMPLE DATA 
// create separate sample data for REST, GraphQL, and CQL so one failure doesn't interfere with the others

//  change the sseconds part of the current timestamp to make a unique date below, mainly for primary key fields
function s_date( seconds ){
  let dt = new Date()
  dt.setSeconds( seconds )
  return dt.toISOString()
}

// GRAPHQL SAMPLE DATA
let gql_user = {user_id:"gql-user", name:"GQL User One", city:"Austin, TX", email:"gql@example.com", member_since:s_date(1), last_login: s_date(2)}
let gql_devices = [
  {user_id:"gql-user", device_name:"iPhone", description:"I use this all day long", device_location:"30.130881, -95.472064", last_used:s_date(1), most_recent_device:"iPhone"},
  {user_id:"gql-user", device_name:"iPad", description:"I use both", device_location:"30.130881, -95.472064", last_used:s_date(1)},
  {user_id:"gql-user", device_name:"Apple Watch", description:"Handy.", device_location:"30.130881, -95.472064", last_used:s_date(1)},
  {user_id:"gql-user", device_name:"MacBook Pro", description:"So powerful and portable!", device_location:"30.130881, -95.472064", last_used:s_date(1)},
  {user_id:"gql-user", device_name:"AppleTV", description:"Best way to stream!", device_location:"30.130881, -95.472064", last_used:s_date(1)} ]
let gql_activities = [
  {user_id:"gql-user", year:2020, month:1, active_at:s_date(1), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"gql-user", year:2020, month:2, active_at:s_date(2), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"gql-user", year:2020, month:3, active_at:s_date(3), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"gql-user", year:2020, month:4, active_at:s_date(4), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"gql-user", year:2020, month:3, active_at:s_date(5), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"gql-user", year:2020, month:3, active_at:s_date(6), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"}
]


// REST SAMPLE DATA
let rest_user = {user_id:"rest-user", name:"rest User One", city:"Austin, TX", email:"rest@example.com", member_since:s_date(1), last_login: s_date(2)}
let rest_devices = [
  {user_id:"rest-user", device_name:"iPhone", description:"I use this all day long", device_location:"30.130881, -95.472064", last_used:s_date(1), most_recent_device:"iPhone"},
  {user_id:"rest-user", device_name:"iPad", description:"I use both", device_location:"30.130881, -95.472064", last_used:s_date(1)},
  {user_id:"rest-user", device_name:"Apple Watch", description:"Handy.", device_location:"30.130881, -95.472064", last_used:s_date(1)},
  {user_id:"rest-user", device_name:"MacBook Pro", description:"So powerful and portable!", device_location:"30.130881, -95.472064", last_used:s_date(1)},
  {user_id:"rest-user", device_name:"AppleTV", description:"Best way to stream!", device_location:"30.130881, -95.472064", last_used:s_date(1)} ]
let rest_activities = [
  {user_id:"rest-user", year:2020, month:1, active_at:s_date(1), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"rest-user", year:2020, month:2, active_at:s_date(2), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"rest-user", year:2020, month:3, active_at:s_date(3), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"rest-user", year:2020, month:4, active_at:s_date(4), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"rest-user", year:2020, month:3, active_at:s_date(5), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"rest-user", year:2020, month:3, active_at:s_date(6), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"}
]


// CQL STATEMENT SAMPLE DATA
let cql_user = {user_id:"cql-user", name:"cql User One", city:"Austin, TX", email:"cql@example.com", member_since:s_date(1), last_login: s_date(2)}
let cql_devices = [
  {user_id:"cql-user", device_name:"iPhone", description:"I use this all day long", device_location:"30.130881, -95.472064", last_used:s_date(1), most_recent_device:"iPhone"},
  {user_id:"cql-user", device_name:"iPad", description:"I use both", device_location:"30.130881, -95.472064", last_used:s_date(1)},
  {user_id:"cql-user", device_name:"Apple Watch", description:"Handy.", device_location:"30.130881, -95.472064", last_used:s_date(1)},
  {user_id:"cql-user", device_name:"MacBook Pro", description:"So powerful and portable!", device_location:"30.130881, -95.472064", last_used:s_date(1)},
  {user_id:"cql-user", device_name:"AppleTV", description:"Best way to stream!", device_location:"30.130881, -95.472064", last_used:s_date(1)} ]
let cql_activities = [
  {user_id:"cql-user", year:2020, month:1, active_at:s_date(1), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"cql-user", year:2020, month:2, active_at:s_date(2), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"cql-user", year:2020, month:3, active_at:s_date(3), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"cql-user", year:2020, month:4, active_at:s_date(4), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"cql-user", year:2020, month:3, active_at:s_date(5), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"cql-user", year:2020, month:3, active_at:s_date(6), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"}
]


// CQL MAPPER SAMPLE DATA
let cqlm_user = {user_id:"cqlm-user", name:"cqlm User One", city:"Austin, TX", email:"cqlm@example.com", member_since:s_date(1), last_login: s_date(2)}
let cqlm_devices = [
  {user_id:"cqlm-user", device_name:"iPhone", description:"I use this all day long", device_location:"30.130881, -95.472064", last_used:s_date(1), most_recent_device:"iPhone"},
  {user_id:"cqlm-user", device_name:"iPad", description:"I use both", device_location:"30.130881, -95.472064", last_used:s_date(1)},
  {user_id:"cqlm-user", device_name:"Apple Watch", description:"Handy.", device_location:"30.130881, -95.472064", last_used:s_date(1)},
  {user_id:"cqlm-user", device_name:"MacBook Pro", description:"So powerful and portable!", device_location:"30.130881, -95.472064", last_used:s_date(1)},
  {user_id:"cqlm-user", device_name:"AppleTV", description:"Best way to stream!", device_location:"30.130881, -95.472064", last_used:s_date(1)} ]
let cqlm_activities = [
  {user_id:"cqlm-user", year:2020, month:1, active_at:s_date(1), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"cqlm-user", year:2020, month:2, active_at:s_date(2), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"cqlm-user", year:2020, month:3, active_at:s_date(3), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"cqlm-user", year:2020, month:4, active_at:s_date(4), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"cqlm-user", year:2020, month:3, active_at:s_date(5), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"},
  {user_id:"cqlm-user", year:2020, month:3, active_at:s_date(6), active_device:"iPhone", activity_description:"Surfing the web", activity_location:"30.130881, -95.472064"}
]


module.exports = {
  gql_user,
  gql_devices,
  gql_activities,
  rest_user,
  rest_devices,
  rest_activities,
  cql_user,
  cql_devices,
  cql_activities,
  cqlm_user,
  cqlm_devices,
  cqlm_activities
}
