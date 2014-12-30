/**
 *        DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2004 Jeremie Briand <jeremie.briand@outlook.fr>
 *
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *  0. You just DO WHAT THE FUCK YOU WANT TO.
 */
var db_full_config = require(__root + 'public/config/database.config');
var db_config = db_full_config[db_full_config.env];
var db_conString = 'postgre://' + db_config.user + ':' + db_config.password + ':' + db_config.port + '@'
    + db_config.host + '/' + db_config.database;

var utils = require(__root + 'utils/utils');

// pool connections
var pg = require('pg.js');
var Logger = require(__root + 'utils/logger').Logger;

// LOGGER
var logger = new Logger();

/**
 * 'connection' event listener
 */
pg.on('connection', function(connection) {

  // Do something
});

// TODO centraliser les connexions

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
function persist(model, callback) {

  if (model && model.id) {
    update(model, callback);
  } else {
    insert(model, callback);
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
 * @param entity
 *          The Entity to find OR the tableName
 * @param args
 *          An object of args for the where clause. i.e { key: value } for display : "key = value"
 * @param callback
 *          The callback with parameter the result of the query.
 */
function find(entity, args, callback) {

  var tableName = entity.tableName || entity;

  // build query
  var alias = '"' + tableName.substring(tableName.indexOf('_') + 1).toLowerCase() + '"';
  var query = 'SELECT * FROM ' + tableName + ' ' + alias;

  // Where clause only if args not empty
  if (utils.isObject(args)) {
    query += ' WHERE ' + toQueryString(args, alias);
  }

  if (entity.tableName) {
    findOptions(query, entity, args, callback);
  } else {
    findOptions(query, null, args, callback);
  }
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
function insert(model, callback) {

  logger.logInfo('Inserting row in table : ' + model.tableName);

  // build query
  var query = buildInsertStatement(model.tableName, model.fields);

  pg.connect(db_conString, function(errConnect, client, done) {

    if (errConnect) {
      logger.logError('Error while connecting to Database.');
      logger.logError('Error : ' + errConnect);
      callback(errConnect);
      return;
    }

    // BEGIN Statement
    logger.logInfo('BEGIN Transaction');
    client.query('BEGIN', function(errBegin) {

      if (errBegin) {
        logger.logError('BEGIN : An error occurred while beginning transaction');
        logger.logError('Error : ' + errBegin);
        performRollback(client, done);
        callback(errBegin);
        return;
      }

      // This function is a sort of insurance that the passed function will be executed on the next VM internal loop,
      // which means it will be the very first executed lines of code.
      // @see http://nodejs.org/api/all.html#all_process_nexttick_callback for more
      process.nextTick(function() {

        // First Insert Statement
        logger.logDebug('INSERT query : ' + query);
        client.query(query, objectToArray(model.fields), function(errQuery, insertedResult) {

          // err treatment.
          if (errQuery) {
            logger.logError('INSERT : An error occurred while inserting row : ' + query);
            logger.logError('Error : ' + errQuery);
            performRollback(client, done);
            callback(errQuery);
            return;
          }

          logger.logInfo('INSERT o2ms query');
          performOneToManyInserts(client, insertedResult.rows[0].id, model, function(errO2M) {

            if (errO2M) {
              logger.logError('INSERT : An error occurred while inserting o2ms rows.');
              logger.logError('Error : ' + errO2M);
              performRollback(client, done);
              callback(errO2M);
              return;
            }

            logger.logInfo('INSERT m2ms query');
            performManyToManyInserts(client, insertedResult.rows[0].id, model, function(errM2M) {

              if (errM2M) {
                logger.logError('INSERT : An error occurred while inserting m2ms rows.');
                logger.logError('Error : ' + errM2M);
                performRollback(client, done);
                callback(errM2M);
                return;
              }

              // COMMIT the transaction
              logger.logInfo('COMMIT Transaction');
              client.query('COMMIT', function() {

                done();

                // Get the inserted Element with all its objects
                find(model, { id : insertedResult.rows[0].id }, function(errSelect, element) {

                  if (errSelect) {
                    logger.logError('SELECT : An error occurred while Re finding the inserted rows.');
                    logger.logError('Error : ' + errSelect);
                  }

                  callback(errSelect, element[0]);
                });
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
 * @param callback
 *          The callback to execute
 */
function update(model, callback) {

  logger.logInfo('Updating row in table : ' + model.tableName);

  // build query
  var query = buildUpdateStatement(model.tableName, model.fields, model.id);

  pg.connect(db_conString, function(errConnect, client, done) {

    if (errConnect) {
      logger.logError('Error while connecting to Database.');
      logger.logError('Error : ' + errConnect);
      callback(errConnect);
      return;
    }

    // BEGIN Statement
    logger.logInfo('BEGIN Transaction');
    client.query('BEGIN', function(errBegin) {

      if (errBegin) {
        logger.logError('BEGIN : An error occurred while beginning transaction');
        logger.logError('Error : ' + errBegin);
        performRollback(client, done);
        callback(errBegin);
        return;
      }

      // This function is a sort of insurance that the passed function will be executed on the next VM internal loop,
      // which means it will be the very first executed lines of code.
      // @see http://nodejs.org/api/all.html#all_process_nexttick_callback for more
      process.nextTick(function() {

        // First Insert Statement
        logger.logDebug('UPDATE query : ' + query);
        client.query(query, objectToArray(model.fields), function(errQuery, insertedResult) {

          // err treatment.
          if (errQuery) {
            logger.logError('UPDATE : An error occurred while updating row : ' + query);
            logger.logError('Error : ' + errQuery);
            performRollback(client, done);
            callback(errQuery);
            return;
          }

          logger.logInfo('UPDATE o2ms query');
          performOneToManyUpdate(client, insertedResult.rows[0].id, model, function(errO2M) {

            if (errO2M) {
              logger.logError('UPDATE : An error occurred while inserting o2ms rows.');
              logger.logError('Error : ' + errO2M);
              performRollback(client, done);
              callback(errO2M);
              return;
            }

            logger.logInfo('UPDATE m2ms query');
            performManyToManyUpdate(client, insertedResult.rows[0].id, model, function(errM2M) {

              if (errM2M) {
                logger.logError('UPDATE : An error occurred while inserting m2ms rows.');
                logger.logError('Error : ' + errM2M);
                performRollback(client, done);
                callback(errM2M);
                return;
              }

              // COMMIT the transaction
              logger.logInfo('COMMIT Transaction');
              client.query('COMMIT', function() {

                done();

                // Get the inserted Element with all its objects
                find(model, { id : insertedResult.rows[0].id }, function(errSelect, element) {

                  if (errSelect) {
                    logger.logError('SELECT : An error occurred while Re finding the Updated rows.');
                    logger.logError('Error : ' + errSelect);
                  }

                  callback(errSelect, element[0]);
                });
              });
            });
          });
        });
      });
    });
  });
}

function findQuery(query, callback) {

  findOptions(query, null, null, callback);
}

function findOptions(query, entity, paramsArray, callback) {

  pg.connect(db_conString, function(errConnect, client, done) {

    if (errConnect) {
      logger.logError('Error while connecting to Database.');
      logger.logError('Error : ' + errConnect);
      callback(errConnect);
      return;
    }

    logger.logDebug('SELECT query : ' + query);

    client.query(query, objectToArray(paramsArray), function(errQuery, entityResult) {

      // err treatment.
      if (errQuery) {
        logger.logError('SELECT : An error occurred while executing query : ' + query);
        logger.logError('Error : ' + errQuery);
        done();
        callback(errQuery, null);
        return;
      }

      if (entityResult.rows.length === 0) {
        done();
        callback(null, entityResult.rows);
        return;
      }

      logger.logInfo('SELECT o2ms query');
      performOneToManySelect(client, entityResult.rows, entity, function(errO2M, o2mResult) {

        if (errO2M) {
          logger.logError('SELECT : An error occurred while Selecting o2ms rows.');
          logger.logError('Error : ' + errO2M);
          done();
          callback(errO2M);
          return;
        }

        logger.logInfo('SELECT m2ms query');
        performManyToManySelect(client, o2mResult, entity, function(errM2M, m2mResult) {

          if (errM2M) {
            logger.logError('Select : An error occurred while Selecting m2ms rows.');
            logger.logError('Error : ' + errM2M);
            done();
            callback(errM2M);
            return;
          }

          // release connection whatever happened.
          done();

          // normal case.
          callback(null, m2mResult);
        });
      });
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
}

/**
 * Selected one to many association from paramsArray ojbect
 * 
 * @param client
 *          The postgres client
 * @param rows
 *          The rows to fill with the one to manies
 * @param paramsArray
 *          The object containing one to many associations
 * @param callback
 *          callback to execute after selection
 */
function performOneToManySelect(client, rows, entity, callback) {

  if (!entity || !entity.oneToMany) {
    callback(null, rows);
    return;
  }

  var o2ms = entity.oneToMany;
  var totalo2ms = Object.keys(o2ms).length;

  var inArray = new Array();
  for ( var i = 0; i < rows.length; i++) {
    inArray.push(rows[i].id);
  }

  if (inArray.length === 0) {
    callback(null, rows);
    return;
  }

  for ( var o2m in o2ms) {

    var o2mTemp = o2ms[o2m];
    var joinTable = o2mTemp.tableName;
    var thisId = o2mTemp.thisId;

    var query = 'SELECT * FROM ' + joinTable + ' WHERE ' + thisId + ' IN (' + inArray.join(',') + ')';

    client.query(query, function(err, oneToManyResult) {

      // err treatment.
      if (err) {
        logger.logError('SELECT : An error occurred while executing query : ' + query);
        logger.logError('Error : ' + err);
        callback(err, null);
        return;
      }

      for ( var i = 0; i < rows.length; i++) {
        rows[i][o2m] = new Array();
        for ( var j = 0; j < oneToManyResult.rows.length; j++) {
          if (rows[i].id == oneToManyResult.rows[j][thisId]) {
            rows[i][o2m].push(oneToManyResult.rows[j]);
          }
        }
      }

      totalo2ms--;
      if (totalo2ms <= 0) {
        callback(null, rows);
      }
    });
  }
}

/**
 * Select many to many association from paramsArray ojbect
 * 
 * @param client
 *          The postgres client
 * @param rows
 *          The rows to fill with the one to manies
 * @param paramsArray
 *          The object containing one to many associations
 * @param callback
 *          callback to execute after selection
 */
function performManyToManySelect(client, rows, entity, callback) {

  if (!entity || !entity.manyToMany) {
    callback(null, rows);
    return;
  }

  var m2ms = entity.manyToMany;
  var totalm2ms = Object.keys(m2ms).length;

  var inArray = new Array();
  for ( var i = 0; i < rows.length; i++) {
    inArray.push(rows[i].id);
  }

  if (inArray.length === 0) {
    callback(null, rows);
    return;
  }

  for ( var m2m in m2ms) {

    var m2mTemp = m2ms[m2m];
    var joinTable = m2mTemp.joinTableName;
    var table = m2mTemp.tableName;
    var thisId = m2mTemp.thisId;
    var valueId = m2mTemp.valueId;

    var query = 'SELECT DISTINCT * FROM ' + table;
    query += ' JOIN ' + joinTable + ' ON ' + joinTable + '.' + valueId + '=' + table + '.id';
    query += ' WHERE ' + joinTable + '.' + thisId + ' IN (' + inArray.join(',') + ')';

    client.query(query, function(err, manyToManyResult) {

      // err treatment.
      if (err) {
        logger.logError('SELECT : An error occurred while executing query : ' + query);
        logger.logError('Error : ' + err);
        callback(err, null);
        return;
      }

      for ( var i = 0; i < rows.length; i++) {
        rows[i][m2m] = new Array();

        for ( var j = 0; j < manyToManyResult.rows.length; j++) {
          if (rows[i].id == manyToManyResult.rows[j][thisId]) {
            rows[i][m2m].push(manyToManyResult.rows[j]);
          }
        }
      }

      totalm2ms--;
      if (totalm2ms <= 0) {
        callback(null, rows);
      }
    });
  }
}

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

      var query = 'INSERT INTO ' + m2mTemp.joinTableName;
      query += ' ("' + m2mTemp.thisId + '", "' + m2mTemp.valueId + '") ';
      query += 'VALUES (' + id + ', ' + m2mTemp.values[i].id + ') ';

      logger.logDebug('INSERT query : ' + query);
      client.query(query, function(err, result) {

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
 * Update into database the values of the manyToMany elements of the given model
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
function performManyToManyUpdate(client, id, model, callback) {

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

  // Delete join entries before inserting new ones

  for ( var m2m in m2ms) {

    var m2mTemp = m2ms[m2m];

    var deleteQuery = 'DELETE * FROM ' + m2mTemp.joinTableName + ' WHERE ' + m2mTemp.thisId + ' = ' + id;

    client.query(deleteQuery, function(errDelete, deleteResult) {

      if (errDelete) {
        logger.logError('DELETE : An error occurred while deleting row : ' + deleteQuery);
        callback(errDelete);
        return;
      }

      for ( var i = 0; i < m2mTemp.values.length; i++) {

        var query = 'INSERT INTO ' + m2mTemp.joinTableName;
        query += ' ("' + m2mTemp.thisId + '", "' + m2mTemp.valueId + '") ';
        query += 'VALUES (' + id + ', ' + m2mTemp.values[i].id + ') ';

        logger.logDebug('INSERT query : ' + query);
        client.query(query, function(err, result) {

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
    });
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
      element[o2mTemp.thisId] = id;
      var query = buildInsertStatement(o2mTemp.tableName, element);

      logger.logDebug('INSERT query : ' + query);
      client.query(query, objectToArray(element), function(err, result) {

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
 * Update into database the values of the oneToMany elements of the given model
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
function performOneToManyUpdate(client, id, model, callback) {

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
      element[o2mTemp.thisId] = id;
      var query = buildUpdateStatement(o2mTemp.tableName, element, element.id);

      logger.logDebug('UPDATE query : ' + query);
      client.query(query, objectToArray(element), function(err, result) {

        if (err) {
          logger.logError('UPDATE : An error occurred while inserting row : ' + query);
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

  if (utils.isObject(args)) {
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

  if (utils.isObject(object)) {
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

  if (utils.isObject(fields)) {
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

/**
 * Build an update statement with the table name and the given object. Properties names are the columns names.
 * 
 * @param tableName
 *          The name of the table where to insert the object
 * @param fields
 *          The fields to insert
 * @returns The query as a String
 */
function buildUpdateStatement(tableName, fields, id) {

  var query = 'UPDATE ' + tableName + ' SET ';

  if (utils.isObject(fields)) {
    var idx = 1;
    for ( var col in fields) {

      if (idx > 1) {
        query += ', ';
      }
      query += '"' + col + '" = $' + idx++;
    }
  }

  return query + ' WHERE id = ' + id + ' RETURNING *';
}
