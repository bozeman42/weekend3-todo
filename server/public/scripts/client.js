console.log('js');
$(document).ready(main);

// main code execution starts here
function main(){
  console.log('jQ');
  createEventHandlers();
  refreshTodos();
}

// create handlers for form submit, delete, and complete buttons
function createEventHandlers(){
  $('#todoForm').submit(submitTodo);
  $('#todoContainer').on('click','.delete',deleteTodo);
  $('#todoContainer').on('click','.completeBtn',toggleComplete);
}

// clear to-do list, request todo items from server.
function refreshTodos(){
  $todoList = $('#todoContainer');
  $todoList.empty();
  $.ajax({
    method: 'GET',
    url: '/todo'
  })
  .done(function(response){
    var todoList = response;
    for (var i = 0; i < todoList.length; i += 1){
      appendTodo(todoList[i]);
    }
    $('#todoIn').empty();
  })
  .fail(function(response){
    alert('Failed to retrieve list. Error:',response);
  });
}

// constructs a table row for each to-do item and appends it to the table
function appendTodo(todo){
  var $row = $('<tr></tr>');
  var $checkBox = $('<td></td>');
  var $completedButton;
  if (todo.todo_complete){
    $completedButton = $('<button class="completeBtn btn">(X)</span></button>');
    $row.addClass('complete');
  } else {
    $completedButton = $('<button class="completeBtn btn">( )</button>');
    $row.removeClass('complete');
  }
  $completedButton.data('id',todo.todo_id);
  $checkBox.append($completedButton);
  $row.append($checkBox);
  $row.append(todo.todo_text);
  var $deleteCell = $('<td></td>');
  var $deleteButton = $('<button class="delete btn btn-danger">Delete</button>');
  $deleteButton.data('id',todo.todo_id);
  $deleteCell.append($deleteButton);
  $row.append($deleteCell);
  console.log($row);
  $('#todoContainer').append($row);
}

// takes text input and transmits it to the server to be placed in the database.
// sends object {todo_text}. New todo is incomplete by default
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
      $('#todoIn').val('')
      refreshTodos();
    })
    .fail(function(response){
      alert('POST failed! Status:',response);
    });
  }
}

// sends a delete request for todo item associated with the clicked delete button
function deleteTodo(){
  var id = $(this).data('id');
  console.log('Deleting item with id',id);
  $.ajax({
    method: 'DELETE',
    url: '/todo/'+ id
  })
  .done(function(response){
    console.log('Delete succeeded with response',response);
    refreshTodos();
  })
  .fail(function(response){
    alert('Delete failed with response',response);
  });
}

// toggles completion state of item associated with the complete button
function toggleComplete() {
  var id = $(this).data('id');
  console.log('Toggling complete for',id);
  $.ajax({
    method: 'PUT',
    url: '/todo/'+id
  })
  .done(function(response){
    console.log('Toggle completed success',response);
    refreshTodos();
  })
  .fail(function(response){
    alert('Toggle completed failed',response)
  });
}