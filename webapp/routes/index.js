var request = require('request');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index')
};


exports.meshtermtl = function(req, res){
  console.log("meshtermtl");
  var query_string = "PREFIX urank: <http://www.urank.com/ontologies/urankowl.owl#> " +
  "select distinct ?meshid ?meshname " +
  "WHERE { " +
  "	?x urank:hasID ?meshid.  " +
  "	?x urank:hasName ?meshname. " +
  "	MINUS{ " +
  "	?y urank:hasSubMeshTerms ?x " +
  "	} " +
  " }" +
  " order by ?meshname ";

  var options = {
  	url: 'http://localhost:8080/openrdf-sesame/repositories/karma_data?query=' +encodeURIComponent(query_string),
    headers: {
      'Accept': 'application/sparql-results+json'
    }
  };

  request(options, function(error, response, body){
  	if (!error && response.statusCode == 200) {
  		var json_res = JSON.parse(body);
  		parseMeshterms(json_res,res);
  	}
  });  
};

exports.meshtermsl = function(req, res){
  console.log("meshtermsl "+ req.query.meshtermID);

  var query_string = "PREFIX urank: <http://www.urank.com/ontologies/urankowl.owl#> " +
  "select distinct ?meshid ?meshname " +
  "WHERE { " +
  "	?x urank:hasID '" + req.query.meshtermID + "' ." +
  "	?x urank:hasSubMeshTerms ?y. " +
  "	?y urank:hasID ?meshid. " +
  "	?y urank:hasName ?meshname ." +
  " }" +
  " order by ?meshname ";

  var options = {
  	url: 'http://localhost:8080/openrdf-sesame/repositories/karma_data?query=' +encodeURIComponent(query_string),
    headers: {
      'Accept': 'application/sparql-results+json'
    }
  };

  request(options, function(error, response, body){
  	console.log(error);
  	console.log(response);
  	console.log(body);
  	if (!error && response.statusCode == 200) {
  	  var json_res = JSON.parse(body);
  	  parseMeshterms(json_res,res);
  	}
  	else{
  	  res.status(404);
  	}
  });
};

exports.ranking = function(req, res){
  console.log("ranking");
  var ids = req.query.meshtermIDs;
  var ids = '"' + ids.replace(/,/g,'","') + '"';

  var query_string = "PREFIX urank: <http://www.urank.com/ontologies/urankowl.owl#> " +
  "select ?name (COUNT(?uni) AS ?count) " +
  "WHERE { " +
  "	?x urank:hasID ?ids . " +
  "	?paper urank:hasMeshID ?x . " +
  "	?paper urank:hasUniversityAffiliation ?uni. " +
  " ?uni urank:hasName ?name " +
  " FILTER(?ids IN (" + ids + ")) " +
  " }" +
  " group by ?name " +
  " order by ?count ";

  var options = {
  	url: 'http://localhost:8080/openrdf-sesame/repositories/karma_data?query=' +encodeURIComponent(query_string),
    headers: {
      'Accept': 'application/sparql-results+json'
    }
  };

  request(options, function(error, response, body){
  	console.log(error);
  	console.log(response);
  	console.log(body);
  	if (!error && response.statusCode == 200) {
  	  var json_res = JSON.parse(body);
  	  parseRanking(json_res,res);
  	}
  	else{
  	  res.status(404);
  	}
  });
};

exports.papers = function(req, res){
  console.log("papers");
  var ids = req.query.meshtermIDs;
  var ids = '"' + ids.replace(/,/g,'","') + '"';

  var query_string = "PREFIX urank: <http://www.urank.com/ontologies/urankowl.owl#> " +
  "select ?title ?abstract ?author ?pubmed " +
  "WHERE { " +
  "	?x urank:hasID ?ids . " +
  "	?paper urank:hasMeshID ?x . " +
  " ?paper urank:hasTitle ?title.  " +
  " ?paper urank:hasAbstract ?abstract. " +
  " ?paper urank:hasAuthor ?author. " +
  "	?paper urank:hasUniversityAffiliation ?uni. " +
  " ?paper urank:hasPubMedLink ?pubmed. " +
  " ?uni urank:hasName '" + decodeURIComponent(req.query.university) + "' ." +
  " FILTER(?ids IN (" + ids + ")) " +
  " }";

  var options = {
  	url: 'http://localhost:8080/openrdf-sesame/repositories/karma_data?query=' +encodeURIComponent(query_string),
    headers: {
      'Accept': 'application/sparql-results+json'
    }
  };

  request(options, function(error, response, body){
  	console.log(error);
  	console.log(response);
  	console.log(body);
  	if (!error && response.statusCode == 200) {
  	  var json_res = JSON.parse(body);
  	  parsePapers(json_res,res);
  	}
  	else{
  	  res.status(404);
  	}
  });
};


function parseMeshterms(json_res, res) {
  var resp = {};
  resp.meshterms = [];

  var vars = json_res.head.vars;
  for (i in json_res.results.bindings) {
  	var b = json_res.results.bindings[i];
  	//console.log("\nrow "+i+" :");
  	var id='', name='';

  	for (j in vars) {
  		var v = vars[j];
  		//console.log(v+"="+b[v].value);
  		if(v == "meshid")
  			id = b[v].value;
  		else if(v == "meshname")
  			name = b[v].value;
  	}
  	resp.meshterms.push({ "id": id, "name":name });
  }

  //send the response back to the client
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(resp));  
}

function parseRanking(json_res, res) {
  var resp = {};
  resp.universities = [];

  var vars = json_res.head.vars;
  for (i in json_res.results.bindings) {
  	var b = json_res.results.bindings[i];
  	//console.log("\nrow "+i+" :");
  	var uni='', count='';

  	for (j in vars) {
  		var v = vars[j];
  		//console.log(v+"="+b[v].value);
  		if(v == "name")
  			uni = b[v].value;
  		else if(v == "count")
  			count = b[v].value;
  	}
  	resp.universities.push({ "university": uni, "count":count });
  }

  //send the response back to the client
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(resp));  
}

function parsePapers(json_res, res){
  var resp = {};
  resp.papers = {};

  var vars = json_res.head.vars;
  for (i in json_res.results.bindings) {
  	var b = json_res.results.bindings[i];
  	//console.log("\nrow "+i+" :");

  	var title = b["title"].value;
  	if(!(title in resp.papers)){
  	  resp.papers[title] = {};
  	  resp.papers[title].title = title;
  	  resp.papers[title].abstract = b["abstract"].value;
  	  resp.papers[title].authors = [];
      resp.papers[title].pubmedURL = b["pubmed"].value; 	   
  	}
  	resp.papers[title].authors.push(b["author"].value);
  }

  //send the response back to the client
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(resp)); 
}

