/*
 * DB mysql Connections
 * 
 * doc : https://npmjs.org/package/mysql
 */

/**
 * Database config
 */
var db_full_config = require('../public/config/database.config');
var db_config = db_full_config[db_full_config.env];
var db_conString = 'postgre://' + db_config.user + ':' + db_config.password + ':' + db_config.port + '@'
    + db_config.host + '/' + db_config.database;

// pool connections
var pg = require('pg.js');

/**
 * 'connection' event listener
 */
pg.on('connection', function(connection) {

  // Do something
});

/**
 * exports attributes
 */
exports.persist = persist;
exports.find = find;
exports.findQuery = findQuery;
exports.findOptions = findOptions;
exports.findAll = findAll;

/**
 * persist query.
 */
function persist(tableName, model, callback) {

}

/**
 * Find all entities in the given table.
 * 
 * @param tableName
 *          The name of the table as it is in the DB
 * @param callback
 *          The callback with parameter the result of the query.
 */
function findAll(tableName, callback) {

  find(tableName, {}, callback);
}

/**
 * Find entities in the given table.
 * 
 * @param tableName
 *          The name of the table as it is in the DB
 * @param args
 *          An object of args for the where clause. i.e { key: value } for display : "key = value"
 * @param callback
 *          The callback with parameter the result of the query.
 */
function find(tableName, args, callback) {

  // build query
  var alias = '"' + tableName.substring(tableName.indexOf('_') + 1).toLowerCase() + '"';
  var query = 'SELECT * FROM ' + tableName + ' ' + alias;

  // Where clause only if args not empty
  if (typeof args == 'object' && Object.keys(args).length > 0) {
    query += ' WHERE ' + toQueryString(args, alias);
  }

  findOptions(query, args, callback);
}

/**
 * Insert statement
 * 
 * @param model
 *          The model to persist as an object (attribute must have columns names)
 * @param connection
 *          The mysql Connection
 */
function insert(tableName, model, connection, callback) {

  // console.log('Inserting row in table : ' + tableName);
  //
  // for ( var prop in model) {
  // if (model.prop === '') {
  // model.prop = null;
  // }
  // }
  //
  // connection.query('INSERT INTO ' + tableName + ' SET ?', model, function(err, result) {
  //
  // // release connection whatever happened.
  // connection.release();
  //
  // if (err) {
  // console.log('INSERT : An error occurred while inserting row in table : ' + tableName);
  // console.log('Error : ' + err);
  // callback(err, result);
  // return;
  // }
  //
  // if (callback) {
  // callback(null, result.insertId);
  // }
  // });
}

/**
 * Update statement
 * 
 * @param model
 *          The model to persist as an object (attribute must have columns names)
 * @param connection
 *          The mysql Connection
 */
function update(tableName, model, connection, callback) {

  // console.log('updating row number ' + model.id + ' in table : ' + tableName);
  //
  // connection.query('UPDATE ' + tableName + ' SET ? WHERE ID=?', [ model,
  // model.id ], function(err, result) {
  //
  // // release connection whatever happened.
  // connection.release();
  //
  // if (err) {
  // console.log('UPDATE : An error occurred while updating row in table : ' + tableName);
  // console.log('Error : ' + err);
  // callback(err, result);
  // return;
  // }
  //
  // if (callback) {
  // callback(null, result.insertId);
  // }
  // });
}

function findQuery(query, callback) {

  findOptions(query, [], callback);
}

function findOptions(query, paramsArray, callback) {

  pg.connect(db_conString, function(err, client, done) {

    if (err) {
      console.log('Error while connecting to Database.');
      console.log('Error : ' + err);
      callback(err);
      return;
    }

    console.log('SELECT query : ' + query);

    client.query(query, objectToArray(paramsArray), function(err, result) {

      // release connection whatever happened.
      done();

      // err treatment.
      if (err) {
        console.log('SELECT : An error occurred while executing query : ' + query);
        console.log('Error : ' + err);
        callback(err, null);
        return;
      }

      console.log(result);
      // normal case.
      callback(null, result.rows);
    });
  });
}

function toQueryString(args, alias) {

  var queryString = '';

  if (typeof args == 'object' && Object.keys(args).length > 0) {
    var idx = 1;
    for ( var col in args) {
      queryString += alias + '.' + col + ' = $' + idx++;
    }
  }

  return queryString;
}

function objectToArray(object) {

  var array = [];

  if (typeof object == 'object' && Object.keys(object).length > 0) {
    for ( var col in object) {
      array.push(object[col]);
    }
  } else {
    array = object;
  }

  return array;
}
