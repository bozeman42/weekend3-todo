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
    var todoList = response;
    var todo;
    var $li;
    var $checkBox;
    for (var i = 0; i < todoList.length; i += 1){
      todo = todoList[i];
      $li = $('<li></li>');
      console.log(todo.todo_complete);
      if (todo.todo_complete){
        $checkBox = $('<button>(X)</span></button>');
      } else {
        $checkBox = $('<button>( )</button>');
      }
      $li.append($checkBox);
      $li.append(todo.todo_text);
    $('ul').append($li);
    }
    $('#todoIn').empty();
  })
  .fail(function(response){
    alert('Failed to retrieve list. Error:',response);
  });
}

function submitTodo(event){
  event.preventDefault();
  var todoText = $('#todoIn').val();
  if (todoText){
    var newTodo = {
      todo_text: todoText
    };
    $.ajax({
      method: 'POST',
      url: '/todo',
      data: newTodo
    })
    .done(function(response){
      console.log('POST successful. Status:',response);
      refreshTodos();
    })
    .fail(function(response){
      alert('POST failed! Status:',response);
    });
  }
}