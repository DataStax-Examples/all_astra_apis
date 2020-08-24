const {baseURL, restURL, gqlURL, keyspace, username, password, secure_bundle_path, mapper_model} = require('./config')
const got = require('got')
const { v4: uuidv4, v1: uuidv1 } = require( "uuid" )
const camelCase = require('camelcase')
const cassandra = require('cassandra-driver')
const KeyspaceMapper = require('./KeyspaceMapper')
const Client = cassandra.Client
const Mapper = cassandra.mapping.Mapper
const client = new Client({ cloud:{ secureConnectBundle:secure_bundle_path},
                            credentials: {username, password},
                            keyspace})
const mapper = new Mapper(client, mapper_model )
const keyspacemapper = new KeyspaceMapper( client, keyspace )



/* --------------------  MODULE VARIABLES  -------------------- */
let authentication_attempts = 0
let auth_token = ""



/* --------------------  UTILITY FUNCTIONS  ---------------------- */ 
// establish the authToken we'll use for communication with the Astra REST interface
async function authenticate(){
  // return the cached token
  if( auth_token ){
    return auth_token
  }
  try {
    // note, hardcoded to API version 1
    var auth = await post(false)( `${restURL}/v1/auth`, {username:username, password:password})
    if( auth && auth["authToken"] ){
      authentication_attempts = 0 // a good authToken indicates success
      auth_token = auth["authToken"]
    }
    return auth_token
  } catch( e ){
    // TODO: switch on each bad status code; probably factor out that part
    auth_token = ""
    if( e.response ) handleHTTPError( e.response, authenticate )
    console.log( e.responseBody )
  }
}


// Avoid a loop when called from database.authenticate() by passing false
function post( getToken = true, method = "POST" ){
  return async function post_vals( url, post_object ){
    let headers =         {"x-cassandra-request-id": uuidv4()}
    if( getToken ) headers["x-cassandra-token"] = await authenticate()
    try {
      const response = await got(url,
        { method,
          headers,
          json: post_object,
          responseType: 'json'})
      if( response && response.body ){
        body = response.body
        if( body && body.errors && body.errors.length ) throw new Error( body.errors[0].message )
        return body
      } else if( response.statusCode >= 200 && response.statusCode <= 304 ) {
        return { statusCode:response.statusCode }
      } else {
        return response
      }
      // GQL API may return an HTTP success but embed errors into the response
      // throw an exception with the message
    } catch(e) {
      console.log( e );
      if( e && e.response ) handleHTTPError( e.response, ()=> post.apply( arguments ))
    }
  }
}

function get(){
  return async function get_vals( url ){
    try {
      const {body} = await got(url,
        { method: 'GET',
          headers: {"x-cassandra-request-id": uuidv4(), "x-cassandra-token": await authenticate()},
          responseType: 'json'})
      return body
    } catch(e) {
      // need to do more than this; probably re-throw
      handleHTTPError( e.response, get )
      // console.log( e );
    }
  }
}


// handle the various kinds of HTTP Errors
function handleHTTPError( response, retry_function ){
  function log(code, message){ console.log(`--------------------- Encountered HTTP Code ${code}: ${message} ---------------------`); }
  switch ( response.statusCode ) {
    case 304: // Not Modified
        log(304, "Not Modified")
      break;
    case 400: // Bad Request
      log( 400, "Bad Request")
      break;
    case 401: // Unauthorized
        if( authentication_attempts++ < 2 ){ // retry
          retry_function()
        }
        log( 401, `Unauthorized (${authentication_attempts} failed login attempts)`)
      break;
    case 403: // Forbidden
      log( 403, "Forbidden")
      break;
    case 404: // Not Found
      log( 404, "Not Found")
      break;
    case 500: // Internal Server Error
      log( 500, "Internal Server Error")
      break;
    case 501: // Not Implemented
      log( 501, "Not Implemented")
      break;
    case 502: // Bad Gateway
      log( 502, "Bad Gateway")
      break;
    case 503: // Service Unavailable
      log( 503, "Service Unavailable")
      break;
    case 504: // Gateway Timeout
      log( 504, "Gateway Timeout")
      break;
    default:
      log( response.statusCode, "CURRENTLY UNHANDLED CODE - SHOULD IMPLEMENT")
      break;
  }

}

// check for anything false-ish or empty
function check_required_field( property_name, property_obj ){
  if( property_obj === undefined || !property_obj[property_name] || property_obj[property_name] === undefined || property_obj[property_name] === "" ){
    throw new Error("userid is a required field for user changes")
  } 
  return true;
}

// CONVERT THIS:
// {userid: "1234", name:"person", email:"me@here.com",
//      auth_platform:"google", last_ip"1.2.3.4", last_login:"whenever"}
// TO THIS:
//  [{name:"userid", value:"1234"},
//   {name:"name", value:"person"},
//   {name:"email", value:"me@here.com"},
//   {name:"auth_platform", value:"google"},
//   {name:"last_ip", value:"1.2.3.4"},
//   {name:"last_login", value:"whenever"}]
function props_to_columns( property_obj ){
  return Object.entries( property_obj ).map(
    ([key,val]) => {return {name:key, value:val}}
  )
}

function props_to_params( property_obj ){
  return Object.entries( property_obj ).reduce(
    (acc, [key,val]) => {
      acc[`${key} = ?`] = val
      return acc
    } 
  , {})
}

function camelcase_props( property_obj ){
  let obj = {};
  Object.entries( property_obj ).forEach(
    ([key,val]) => obj[camelCase(key)] = val
  )
  return obj;
}

// for some reason the GraphQL API doesn't like quoted properties;
// this function removes the double quotes from object property names
function make_special_json( obj ){
  let json = JSON.stringify( obj )
  json.replace(/\\"/g,"\uFFFF");
  json = json.replace(/"([^"]+)":/g, '$1:').replace(/\uFFFF/g, '\\\"');
  return json
}


const utility = { camelcase_props, make_special_json, props_to_columns, props_to_params, check_required_field, handleHTTPError, get, post, authenticate, client, mapper, keyspacemapper }
module.exports = utility
