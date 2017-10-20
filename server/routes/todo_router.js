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



module.exports = router;