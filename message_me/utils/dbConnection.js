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

  if (model && model.id) {
    update(tableName, model, callback)
  } else {
    insert(tableName, model, callback)
  }
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
 * Insert the given model object into the given table. An then call the callback.
 * 
 * @param tableName
 *          The name of the table.
 * @param model
 *          The Object containing data to insert. Properties names must correspond to DB columns names
 * @param callback
 *          The callback executed after the INSERt statement. It takes two parameters :
 *          <ul>
 *          <li>err : the error if one occured (undefined else)</li>
 *          <li>result : the result of the query with the inserted row.</li>
 *          </ul>
 */
function insert(tableName, model, callback) {

  console.log('Inserting row in table : ' + tableName);

  // for ( var prop in model) {
  // if (model.prop === '') {
  // model.prop = null;
  // }
  // }

  // build query
  var query = buildInsertStatement(tableName, model);

  pg.connect(db_conString, function(err, client, done) {

    if (err) {
      console.log('Error while connecting to Database.');
      console.log('Error : ' + err);
      callback(err);
      return;
    }

    console.log('INSERT query : ' + query);

    client.query(query, objectToArray(paramsArray), function(err, result) {

      // release connection whatever happened.
      done();

      // err treatment.
      if (err) {
        console.log('SELECT : An error occurred while executing query : ' + query);
        console.log('Error : ' + err);
        callback(err);
        return;
      }

      // normal case.
      callback(null, result.rows);
    });
  });

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

      // normal case.
      callback(null, result.rows);
    });
  });
}

/**
 * Take the properties names of the given args and transform it to a parametered WHERE clause.
 * 
 * Exemple :<br>
 * args = { name: 'John', firstname: 'smith'} <br>
 * alias = person
 * 
 * return: 'person.name = $1 AND person.firstname = $2'
 * 
 * @param args
 *          the object containing the properties to put on the query
 * @param alias
 *          the alias of table
 * @returns the WHERE clause as a String
 */
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

/**
 * Transform the given object, to an array of values
 * 
 * @param object
 *          The object to transform.
 * @returns an array of values
 */
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

/**
 * Build an insert statement with the table name and the given object. Properties names are the columns names.
 * 
 * @param tableName
 *          The name of the table where to insert the object
 * @param model
 *          The model object to insert
 * @returns The query as a String
 */
function buildInsertStatement(tableName, model) {

  var query = 'INSERT INTO ' + tableName + ' SET (';
  var values = 'VALUES (';

  if (typeof model == 'object' && Object.keys(model).length > 0) {
    var idx = 1;
    for ( var col in model) {

      if (Array.isArray(model[col])) {
        // We assume it is for a many to many relationship

        continue;
      }

      if (idx > 1) {
        query += ', ';
        values += ', ';
      }
      query += col;
      values += model[col];
      idx++;
    }
  }

  return query + ') ' + values + ') ';
}
