/*
 * DB mysql Connections
 * 
 * doc : https://npmjs.org/package/mysql
 */

/**
 * Database config
 */
var db_full_config = require(__root + 'public/config/database.config');
var db_config = db_full_config[db_full_config.env];
var db_conString = 'postgre://' + db_config.user + ':' + db_config.password + ':' + db_config.port + '@'
    + db_config.host + '/' + db_config.database;

// pool connections
var pg = require('pg.js');
var logger = require(__root + 'utils/logger');

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
    update(tableName, model, callback);
  } else {
    insert(tableName, model, callback);
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

  logger.logInfo('Inserting row in table : ' + tableName);

  // build query
  var query = buildInsertStatement(tableName, model.fields);

  pg.connect(db_conString, function(err, client, done) {

    if (err) {
      logger.logError('Error while connecting to Database.');
      logger.logError('Error : ' + err);
      callback(err);
      return;
    }

    // BEGIN Statement
    logger.logInfo('BEGIN Transaction');
    client.query('BEGIN', function(err) {

      if (err) {
        logger.logError('BEGIN : An error occurred while beginning transaction');
        logger.logError('Error : ' + err);
        performRollback(client, done);
        callback(err);
        return;
      }

      // This function is a sort of insurance that the passed function will be executed on the next VM internal loop,
      // which means it will be the very first executed lines of code.
      // @see http://nodejs.org/api/all.html#all_process_nexttick_callback for more
      process.nextTick(function() {

        // First Insert Statement
        logger.logDebug('INSERT query : ' + query);
        client.query(query, objectToArray(model.fields), function(err, insertedResult) {

          // err treatment.
          if (err) {
            logger.logError('INSERT : An error occurred while inserting row : ' + query);
            logger.logError('Error : ' + err);
            performRollback(client, done);
            callback(err);
            return;
          }

          logger.logInfo('INSERT o2ms query');
          performOneToManyInserts(client, insertedResult.rows[0].id, model, function(err) {

            if (err) {
              logger.logError('INSERT : An error occurred while inserting o2ms rows.');
              logger.logError('Error : ' + err);
              performRollback(client, done);
              callback(err);
              return;
            }

            logger.logInfo('INSERT m2ms query');
            performManyToManyInserts(client, insertedResult.rows[0].id, model, function(err) {

              if (err) {
                logger.logError('INSERT : An error occurred while inserting m2ms rows.');
                logger.logError('Error : ' + err);
                performRollback(client, done);
                callback(err);
                return;
              }

              // COMMIT the transaction
              logger.logInfo('COMMIT Transaction');
              client.query('COMMIT', function() {

                done();
                // normal case.
                callback(null, insertedResult.rows[0]);
              });
            });
          });
        });
      });
    });
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
      logger.logError('Error while connecting to Database.');
      logger.logError('Error : ' + err);
      callback(err);
      return;
    }

    logger.logDebug('SELECT query : ' + query);

    client.query(query, objectToArray(paramsArray), function(err, result) {

      // release connection whatever happened.
      done();

      // err treatment.
      if (err) {
        logger.logError('SELECT : An error occurred while executing query : ' + query);
        logger.logError('Error : ' + err);
        callback(err, null);
        return;
      }

      // normal case.
      callback(null, result.rows);
    });
  });
}

/**
 * If there was a problem rolling back the query something is seriously messed up. Return the error to the done function
 * to close & remove this client from the pool. If you leave a client in the pool with an unaborted transaction __very
 * bad things__ will happen.
 * 
 * @param client
 *          The client who open the transaction
 * @param done
 *          The done function the must be called after the rollback
 */
function performRollback(client, done) {

  logger.logInfo('ROLLBACK Transaction');
  client.query('ROLLBACK', function(err) {

    return done(err);
  });
};

/**
 * Insert into database the values of the manyToMany elements of the given model
 * 
 * @param client
 *          the postgres client
 * @param id
 *          the id of the model
 * @param model
 *          the model containing the manyToManies elements
 * @param callback
 *          the cb executed after all insert statements
 */
function performManyToManyInserts(client, id, model, callback) {

  var m2ms = model.manyToMany;
  var NumberInserted = 0;
  var totalInsert = 0;

  if (!m2ms) {
    callback();
    return;
  }

  for ( var m2m in m2ms) {
    if (!m2ms[m2m].values) {
      callback();
      return;
    }
    totalInsert += m2ms[m2m].values.length;
  }

  for ( var m2m in m2ms) {

    var m2mTemp = m2ms[m2m];
    for ( var i = 0; i < m2mTemp.values.length; i++) {

      var query = 'INSERT INTO ' + m2mTemp.tableName;
      query += ' ("' + m2mTemp.thisId + '", "' + m2mTemp.valueId + '") ';
      query += 'VALUES (' + id + ', ' + m2mTemp.values[i].id + ') ';

      logger.logDebug('INSERT query : ' + query);
      var q = client.query(query, function(err, result) {

        if (err) {
          logger.logError('INSERT : An error occurred while inserting row : ' + query);
          callback(err);
          return;
        }

        // All the m2m query are performed in parallele.
        // We need to be sure every query ended, and ended without error before calling the callback.
        NumberInserted++;
        if (NumberInserted >= totalInsert) {
          NumberInserted = 0;
          callback();
        }
      });
    }
  }
}

/**
 * Insert into database the values of the oneToMany elements of the given model
 * 
 * @param client
 *          the postgres client
 * @param id
 *          the id of the model
 * @param model
 *          the model containing the onetoManies elements
 * @param callback
 *          the cb executed after all insert statements
 */
function performOneToManyInserts(client, id, model, callback) {

  var o2ms = model.oneToMany;
  var NumberInserted = 0;
  var totalInsert = 0;

  if (!o2ms) {
    callback();
    return;
  }

  for ( var o2m in o2ms) {
    if (!o2ms[o2m].values) {
      callback();
      return;
    }
    totalInsert += o2ms[o2m].values.length;
  }

  for ( var o2m in o2ms) {

    var o2mTemp = o2ms[o2m];
    for ( var i = 0; i < o2mTemp.values.length; i++) {

      var element = o2mTemp.values[i];
      element[o2mTemp.valueId] = id;
      var query = buildInsertStatement(o2mTemp.tableName, element);

      logger.logDebug('INSERT query : ' + query);
      var q = client.query(query, objectToArray(element), function(err, result) {

        if (err) {
          logger.logError('INSERT : An error occurred while inserting row : ' + query);
          callback(err);
          return;
        }

        // All the o2m query are performed in parallele.
        // We need to be sure every query ended, and ended without error before calling the callback.
        NumberInserted++;
        if (NumberInserted >= totalInsert) {
          NumberInserted = 0;
          callback();
        }
      });
    }
  }
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
 * @param fields
 *          The fields to insert
 * @returns The query as a String
 */
function buildInsertStatement(tableName, fields) {

  var query = 'INSERT INTO ' + tableName + ' (';
  var values = 'VALUES (';

  if (typeof fields == 'object' && Object.keys(fields).length > 0) {
    var idx = 1;
    for ( var col in fields) {

      if (idx > 1) {
        query += ', ';
        values += ', ';
      }
      query += '"' + col + '"';
      values += '$' + idx++;
    }
  }

  return query + ') ' + values + ') RETURNING *';
}
