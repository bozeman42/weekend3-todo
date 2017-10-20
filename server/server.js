var express = require('express');
var port = process.env.PORT || 5000;

var bodyParser = require('body-parser');
var todoRouter = require('./routes/todo_router.js')
var app = express();

app.use(express.static('server/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/todo',todoRouter);

app.listen(port, function(){
  console.log("Listening on port",port);
});