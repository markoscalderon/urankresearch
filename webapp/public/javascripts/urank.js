$(document).ready(function(){
  
    createCheckbox(); //onload call the create checkboxes function which will fill the container term-display class with top level mesh terms
    $('#subterms').toggle();


  });

 function createCheckbox() {

  //do an ajax call here for the mesh terms
  //get the result in json format and add mesh terms
  var jsonstirng='[{"term":"meshterm1"},{"term":"meshterm2"},{"term":"meshterm3"}]'; // maybe we need here id too 
  var i=0;
  var json=$.parseJSON(jsonstirng);  
  $.each(json,function(){

    $('<input/>', {
      id: 'myCheckbox'+i,
      type: 'checkbox',
      onclick: displaysubterm(this['term']),
      value: this['term'] //change this later either to mesh id or meshterm
    }).appendTo('#meshterms');
    var s=this['term'];
    $('<label/>', {
      for: 'myCheckbox'+i,
      text:s // this is definitely mesh term
    }).appendTo('#meshterms');

    $('<br>').appendTo('#meshterms');
    i++;
  });
  
}

function displaysubterm (mainterm){

  // write an ajax function to check if a main term has subterm and then display it as a list of checkboxes



}

//Data Visualization
google.load("visualization", "1", {packages:["corechart","table"]});
google.setOnLoadCallback(drawChart);
var chart = {};
var data = [
    ['University', 'Ranking'],
    ['', 0]
  ];

function generateChart(){
  var meshtermIDs = "68001698,68013677";

  $.getJSON( "/ranking", { "meshtermIDs": meshtermIDs } )
    .done(function( json ) {
      var res = json.universities.sort(function(b,a) { return parseFloat(a.count) - parseFloat(b.count) } );
      data = [
        ['University', 'Ranking']
      ];
      counter = 0;
      res.forEach(function(elem){
        if(counter<10){
          var row = [];
          row.push(elem['university']);
          row.push(parseInt(elem['count']));
          data.push(row);  
        }
        counter+=1;
      });
      drawChart();
    })
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
  });
  //console.log(data);
  
}


function drawChart() {
  dataChart = google.visualization.arrayToDataTable(data);
  console.log(dataChart);
  var options = {
    title: 'Top University Chart',
    is3D: true,
    backgroundColor: '#EEEEEE',
    tooltip: { text: 'percentage'}
  };
  chart = new google.visualization.PieChart(document.getElementById('unichart'));
  
  chart.draw(dataChart, options);
  google.visualization.events.addListener(chart, 'select', selectHandler);
}


function selectHandler(e) {
  var uniselection = data[chart.getSelection()[0].row+1][0];
  var meshtermIDs = "68001698,68013677";

  $.getJSON( "/papers", { "meshtermIDs": meshtermIDs, "university":encodeURIComponent(uniselection) } )
    .done(function( json ) {
      console.log(json);
      var rows = [];
      for(paper in json.papers){
        var row = [];
        row.push(json.papers[paper].title);
        row.push(json.papers[paper].abstract);
        row.push(json.papers[paper].authors.toString());
        row.push(json.papers[paper].pubmedURL);
        rows.push(row); 
      }
      drawTable(rows);
    })
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
  });
}

function drawTable(rows) {
  var datatable = new google.visualization.DataTable();
  datatable.addColumn('string', 'Title');
  datatable.addColumn('string', 'Abstract');
  datatable.addColumn('string', 'Authors');
  datatable.addColumn('string', 'PubMed Link');
  
  datatable.addRows(rows);

  var table = new google.visualization.Table(document.getElementById('tablepapers'));
  table.draw(datatable, {showRowNumber: true});
}