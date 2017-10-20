console.log('js');
$(document).ready(main);

function main(){
  console.log('jQ');
  $('#todoForm').submit(submitTodo);
  refreshTodos();
}


// clear to-do list and request list from server
function refreshTodos(){
  $('ul').empty();
  $.ajax({
    method: 'GET',
    url: '/todo'
  })
  .done(function(response){
    console.log(response[0]);
    $li = $('<li></li>');
    $li.text(response[0].todo_text);
    $('ul').append($li);
  })
  .fail(function(response){
    alert('Failed to retrieve list. Error:',response);
  });
}

function submitTodo(event){
  event.preventDefault();
  var newTodo = {
    todo_text: $('#todoIn').val()
  };
  $.ajax({
    method: 'POST'
  })
}