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


