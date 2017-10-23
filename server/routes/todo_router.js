var express = require('express');
var pg = require('pg');
var router = express.Router();

// create pg pool config
// var config = {
//   database: 'deneb',
//   host: 'localhost',
//   port: 5432,
//   max: 10,
//   idleTimeoutMillis: 30000
// };



var pool = require('../modules/pool.js');

// retrieves all todo list items from the database
router.get('/',function(req,res){
  console.log('in the GET route');
  pool.connect(function(errorConnectingToDb, db, done){
    done();
    if(errorConnectingToDb) {
      console.log('Error connecting to DB');
      res.sendStatus(500);
    } else {
      var queryText = 'SELECT * FROM "todo_list" ORDER BY "todo_complete", "todo_duedate", "todo_id"';
      db.query(queryText, function(errorQueryingDb, result){
        if (errorQueryingDb){
          console.log('Error querrying database in GET route');
          console.log(queryText);
          console.log(errorQueryingDb);
          res.sendStatus(500);
        } else {
          console.log('GET route returning rows');
          res.send(result.rows);
        }
      });
    }
  });
});

// adds new todo item to the database. state of "completed" is false by default
router.post('/', function(req,res){
  var newTodo = req.body;
  console.log(newTodo);
  pool.connect(function(errorConnectingToDb,db,done){
    done();
    if(errorConnectingToDb){
      console.log('Error connecting to DB');
      res.sendStatus(500);
    } else {
      var queryText = 'INSERT INTO "todo_list" ("todo_text","todo_duedate") VALUES ($1, $2)';
      db.query(queryText,[newTodo.todo_text,newTodo.todo_duedate],function(errorQueryingDb,result) {
        if (errorQueryingDb) {
          console.log('Error in POST route querying database with');
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

// Deletes todo item with id :id
router.delete('/:id',function(req,res){
  var todoId = req.params.id;
  console.log('Deleting to-do',todoId);
  pool.connect(function(errorConnectingToDb,db,done){
    done();
    if (errorConnectingToDb){
      console.log('Error connecting to database in DELETE route');
      res.sendStatus(500);
    } else {
      var queryText = 'DELETE FROM "todo_list" WHERE "todo_id" = $1;';
      db.query(queryText,[todoId],function(errorQueryingDb){
        if (errorQueryingDb){
          console.log('Error in DELETE query');
          console.log(queryText);
          res.sendStatus(500);
        } else {
          console.log('Item deleted');
          res.sendStatus(200);
        }
      });
    }
  });
});

router.put('/:id',function(req,res){
  var todoId = req.params.id;
  console.log('Toggling complete on to-do',todoId);
  pool.connect(function(errorConnectingToDb,db,done){
    done();
    if (errorConnectingToDb){
      console.log('Error connecting to database in PUT route');
      res.sendStatus(500);
    } else {
      var queryText = 'UPDATE "todo_list" SET "todo_complete" = NOT "todo_complete" WHERE "todo_id" = $1;';
      db.query(queryText,[todoId],function(errorQueryingDb){
        if (errorQueryingDb){
          console.log('Error in UPDATE query');
          res.sendStatus(500);
        } else {
          console.log('UPDATE succeeded');
          res.sendStatus(200);
        }
      });
    }
  });
});

function truncateDate(date) {

}

module.exports = router;