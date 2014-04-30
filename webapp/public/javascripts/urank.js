$(document).ready(function(){
  
   createCheckbox(); //onload call the create checkboxes function which will fill the container term-display class with top level mesh terms
   $('#second_level_mesh_terms').prop('disabled',true);
    // $('#subterms').toggle();
    $('#selectedchoices').tagsinput({
      itemValue: 'id',
      itemText:'text'
    });
  
  });
var send_mesh_list=new Array();

  
  
function toggle_second_level_term_select_box()
{
  $('#second_level_mesh_terms').prop('disabled',true);
}

 function createCheckbox() {

  //do an ajax call here for the mesh terms
  //get the result in json format and add mesh terms
 
  var jsonstring='[{"term":"meshterm1","id":"456845"},{"term":"meshterm2","id":"665656"},{"term":"meshterm3","id":"667656"}]'; 
  var i=0;

  

  $.getJSON( "/meshterms/toplevel")
    .done(function( json ) {
       
        $.each(json.meshterms,function(){

      $('<option  value="'+this['id']+'" onclick="displaysubterm(value)">'+this['name']+' </option>').appendTo('#top_level_mesh_terms');
      });
    
    })
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
  }); 

  }


  function addToList()
  {


    if(!$('#second_level_mesh_terms').is(':disabled'))
      {
        i=1;
        meshid=$('#second_level_mesh_terms').val();
        meshterm=$('#second_level_mesh_terms :selected').text();
        //alert(meshid+" "+meshterm);
        //$('#selectedchoices').append('<option value="'+meshid+'">'+meshterm+'</option>' );
        //$('#selectedchoices').tagsinput('add',meshterm);
        if(!(meshid=="NA"))
        {
          if(meshid=="All")
          {
             mainterm=$('#top_level_mesh_terms').val();
              $.getJSON( "/meshterms/secondlevel",'meshtermID='+mainterm)
             .done(function( json ) {
                if(json.meshterms.length==0)
                {
                    return;
                }
                else
                {
                    $.each(json.meshterms,function(){
                      $('#selectedchoices').tagsinput('add',{id:this['id'], text:this['name']});
               
                      }); 
                } 
            });//end of if condition
        }
          else
            $('#selectedchoices').tagsinput('add',{id:meshid, text:meshterm});
      }
    }                 
      
      else
      {
       
           meshid=$('#top_level_mesh_terms').val();
          meshterm=$('#top_level_mesh_terms :selected').text();
        $('#selectedchoices').tagsinput('add',{id:meshid, text:meshterm});
      }

  }

  
function displaysubterm (mainterm){

  // write an ajax function to check if a main term has subterm and then display it as a list of checkboxes


  if(mainterm=="NA")
    $('#second_level_mesh_terms').prop('disabled',true);
  else
  {

     $.getJSON( "/meshterms/secondlevel",'meshtermID='+mainterm)
    .done(function( json ) {
      if(json.meshterms.length==0)
      {
         $('#second_level_mesh_terms').empty();
         $('<option value="NA" selected >Please select a subtopic</option>').appendTo('#second_level_mesh_terms');

         $('#second_level_mesh_terms').prop('disabled',true);
         return;
      }
      $('#second_level_mesh_terms').prop('disabled',false);
      $('#second_level_mesh_terms').empty();
       $('<option value="NA" selected >Please select a subtopic</option>').appendTo('#second_level_mesh_terms');
       $('<option value="All" selected >Select All</option>').appendTo('#second_level_mesh_terms');
  
        $.each(json.meshterms,function(){
     
        $('<option  value="'+this['id']+'" >'+this['name']+' </option>').appendTo('#second_level_mesh_terms');
      });
    
    })
    .fail(function( jqxhr, textStatus, error ) {
      var err = textStatus + ", " + error;
      console.log( "Request Failed: " + err );
  }); 
  }
 
} // end of display subterm function

//Data Visualization
google.load("visualization", "1", {packages:["corechart","table"]});
google.setOnLoadCallback(drawChart);
var chart = {};
var data = [
    ['University', 'Ranking'],
    ['', 0]
  ];

function generateChart(){
  
  var meshtermIDs = $('#selectedchoices').val().toString();
  $.getJSON( "/ranking",{"meshtermIDs":meshtermIDs})
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
    backgroundColor: '#EEEEEE',
    tooltip: { text: 'percentage'}
  };
  chart = new google.visualization.PieChart(document.getElementById('unichart'));
  
  chart.draw(dataChart, options);
  google.visualization.events.addListener(chart, 'select', selectHandler);
}


function selectHandler(e) {
  var uniselection = data[chart.getSelection()[0].row+1][0];
  var meshtermIDs = $('#selectedchoices').val().toString();
  //"68001698,68013677";

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
