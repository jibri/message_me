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

// pool connections
var mysql = require('mysql');
var pool = mysql.createPool(db_config);

/**
 * 'connection' event listener
 */
pool.on('connection', function(connection) {

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

  pool.getConnection(function(err, connection) {

    if (err) {
      console.log('Error while connexting to Database.');
      console.log('Error : ' + err);
      callback(err);
      return;
    }

    if (model.id) {
      update(tableName, model, connection, callback);
    } else {
      insert(tableName, model, connection, callback);
    }
  });
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
  var query = 'SELECT * FROM ' + tableName + ' ' + tableName.substring(tableName.indexOf('_') + 1).toLowerCase();

  // Where clause only if args not empty
  if (typeof args == 'object' && Object.keys(args).length > 0) {
    query += ' WHERE ? ';
  } else {
    args = {};
  }

  var option = { sql : query,
                values : args };

  findOptions(option, callback);
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

  console.log('Inserting row in table : ' + tableName);

  for ( var prop in model) {
    if (model.prop === '') {
      model.prop = null;
    }
  }

  connection.query('INSERT INTO ' + tableName + ' SET ?', model, function(err, result) {

    // release connection whatever happened.
    connection.release();

    if (err) {
      console.log('INSERT : An error occurred while inserting row in table : ' + tableName);
      console.log('Error : ' + err);
      callback(err, result);
      return;
    }

    if (callback) {
      callback(null, result.insertId);
    }
  });
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

  console.log('updating row number ' + model.id + ' in table : ' + tableName);

  connection.query('UPDATE ' + tableName + ' SET ? WHERE ID=?', [ model,
                                                                 model.id ], function(err, result) {

    // release connection whatever happened.
    connection.release();

    if (err) {
      console.log('UPDATE : An error occurred while updating row in table : ' + tableName);
      console.log('Error : ' + err);
      callback(err, result);
      return;
    }

    if (callback) {
      callback(null, result.insertId);
    }
  });
}

function findQuery(query, callback) {

  var option = { sql : query,
                nestTables : query.indexOf(' JOIN ') >= 0 };

  findOptions(option, callback);
}

function findOptions(options, callback) {

  pool.getConnection(function(err, connection) {

    if (err) {
      console.log('Error while connecting to Database.');
      console.log('Error : ' + err);
      callback(err);
      return;
    }

    console.log('SELECT query : ' + options.sql);

    connection.query(options, function(errFind, result) {

      // release connection whatever happened.
      connection.release();

      // err treatment.
      if (errFind) {
        console.log('SELECT : An error occurred while executing query : ' + options.sql);
        console.log('Error : ' + errFind);
        callback(errFind, null);
        return;
      }

      // normal case.
      callback(null, result);
    });
  });
}
