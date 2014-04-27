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
  var json=$.parseJSON(jsonstring);  
  $.each(json,function(){

      $('<option  value="'+this['id']+'" onclick="displaysubterm(value)">'+this['term']+' </option>').appendTo('#top_level_mesh_terms');
      });
  }

  function bdelete(ele)
  {
    var inc=ele;
    var callingeleid=ele.id.substring(6);
    //alert(callingeleid);

    send_mesh_list.splice($.inArray(callingeleid,send_mesh_list),1);
    alert("send list after removing "+callingeleid+" is "+send_mesh_list.toString());

    //$('#list').remove('#'+)
  }

  function addToList()
  {


        


    if(!$('#second_level_mesh_terms').disabled)
      {
        meshid=$('#top_level_mesh_terms').val();
        meshterm=$('#top_level_mesh_terms :selected').text();
        alert(meshid+" "+meshterm);
        //$('#selectedchoices').append('<option value="'+meshid+'">'+meshterm+'</option>' );
        //$('#selectedchoices').tagsinput('add',meshterm);
        $('#selectedchoices').tagsinput('add',{id:meshid, text:meshterm});

        alert($('#selectedchoices').val());
        var check;
      
      }
      else
      {

      }

  }

  


  
  


function displaysubterm (mainterm){

  // write an ajax function to check if a main term has subterm and then display it as a list of checkboxes

  //alert(mainterm);
  //alert(mainterm);
  if(mainterm=="NA")
    $('#second_level_mesh_terms').prop('disabled',true);
  else
    $('#second_level_mesh_terms').prop('disabled',false);

  $('#second_level_mesh_terms').empty().append('<option value="NA" selected >Please select a subtopic</option>');
 


  //make an ajax call to get back from server the subterms if it is present

    
  //$('#second_level_mesh_terms').prop('disabled',true);*/




}


