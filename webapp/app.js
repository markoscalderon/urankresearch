/*var express = require('express');
var app = express();

var SparqlClient = require('sparql-client');
var util = require('util');
var endpoint = 'http://dbpedia.org/sparql';
 

 
app.get('/meshterms', function(req, res) {
	res.send([{name:'wine1'}, {name:'wine2'}]);
});
app.get('/papers', function(req, res) {
	var meshids = req.query.meshids;

	res.send({name: "The Name", description: "description"});
});
 
app.listen(3000);
console.log('Listening on port 3000...');*/


var SparqlClient = require('sparql-client');
var util = require('util');
var endpoint = 'http://localhost:8080/openrdf-sesame/repositories/karma_data';

// Get the leaderName(s) of the given citys
// if you do not bind any city, it returns 10 random leaderNames
var query = "SELECT ?meshid ?meshterm FROM <http://localhost:8080/openrdf-sesame/repositories/karma_data> WHERE { ?city <http://dbpedia.org/property/leaderName> ?leaderName } LIMIT 10";
var client = new SparqlClient(endpoint);
console.log("Query to " + endpoint);
console.log("Query: " + query);
client.query(query)
  //.bind('city', 'db:Chicago')
  //.bind('city', 'db:Tokyo')
  //.bind('city', 'db:Casablanca')
  .bind('city', '<http://dbpedia.org/resource/Vienna>')
  .execute(function(error, results) {
  process.stdout.write(results);
});


