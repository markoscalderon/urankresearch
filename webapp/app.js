
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {
    layout: false
  });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);
app.get('/meshterms/toplevel',routes.meshtermtl);

// example http://localhost:3000/meshterms/secondlevel?meshtermID=68016390
app.get('/meshterms/secondlevel',routes.meshtermsl); //receive a toplevel meshID

// example http://localhost:3000/ranking?meshtermIDs=68001698,68013677
app.get('/ranking',routes.ranking); //receive a list of meshterms IDs

// example http://localhost:3000/papers?meshtermIDs=68001698,68013677&university=Polytechnic+Institute+of+Milan
app.get('/papers',routes.papers); //receive a list of meshterms IDs and a university

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
