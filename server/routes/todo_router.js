var express = require('express');
var pg = require('pg');

var router = express.Router();

// create pg pool config
var config = {
  database: 'deneb',
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

router.get('/',function(req,res){
  console.log('in the GET route');
  pool.connect(function(errorConnectingToDb, db, done){
    done();
    if(errorConnectingToDb) {
      console.log('Error connecting to DB');
      res.sendStatus(500);
    } else {
      var queryText = 'SELECT * FROM "todo_list"';
      db.query(queryText, function(errorQueryingDb, result){
        if (errorQueryingDb){
          console.log('Error querrying database');
          console.log(queryText);
          console.log(errorQueryingDb);
          res.sendStatus(500);
        } else {
          console.log('returning rows');
          res.send(result.rows);
        }
      });
    }
  });
});

router.post('/', function(req,res){
  var newTodo = req.body;
  console.log(newTodo);
  pool.connect(function(errorConnectingToDb,db,done){
    done();
    if(errorConnectingToDb){
      console.log('Error connecting to DB');
      res.sendStatus(500);
    } else {
      var queryText = 'INSERT INTO "todo_list" ("todo_text") VALUES ($1)';
      db.query(queryText,[newTodo.todo_text],function(errorQueryingDb,result) {
        if (errorQueryingDb) {
          console.log('Error querying database with');
          console.log(queryText);
          res.sendStatus(500);
        } else {
          console.log('New todo added:',newTodo);
          res.sendStatus(201);
        }
      });
    }
  });
});

module.exports = router;