console.log('js');
$(document).ready(main);

// main code execution starts here
function main(){
  console.log('jQ');
  createEventHandlers();
  refreshTodos(0);
}

// create handlers for form submit, delete, and complete buttons
function createEventHandlers(){
  $('#todoForm').submit(submitTodo);
  $('#todoContainer').on('click','.delete',areYouSure);
  $('#todoContainer').on('click','.completeBtn',toggleComplete);
  $('#todoContainer').on('click','.confirmDelete',deleteTodo);
  $('#todoContainer').on('click','.cancelDeleteBtn',refreshPage);
}

function refreshPage(){
  refreshTodos(0);
}

// clear to-do list, request todo items from server.
// id is one of the following:
// -1 if the latest item (highest todo_id) should be animated
// id will be set to the highest id in this function
// 0 if no item should be animated
// a valid todo_id if a specific item should be animated
// this is passed along to the appendTodo function
function refreshTodos(id){
  $todoList = $('#todoContainer');
  $.ajax({
    method: 'GET',
    url: '/todo'
  })
  .done(function(response){
    var todoList = response;
    // if id == -1, set id to the highest todo_id of returned values
    if (id === -1) {
      todoList.forEach(function(todo){
        id = todo.todo_id > id? todo.todo_id:id;
      });
      console.log('Max id is',id);
    }
    $todoList.empty();
    for (var i = 0; i < todoList.length; i += 1){
      appendTodo(todoList[i],id);
      console.log(todoList[i]);
    }
    $('li:hidden').slideDown();
    $('#todoIn').empty();
  })
  .fail(function(response){
    alert('Failed to retrieve list. Error:',response);
  });
}

// constructs a list item for each to-do item and appends it to the list
// id is one of the following:
// 0 if no item should be animated
// a valid todo_id if a specific item should be animated
function appendTodo(todo,id){
  var $row = $('<li></li>');
  var $rowDiv = $('<div class="itemDiv"></div>');
  var $completedButton = $('<div class="completeBtn"></div>');
  var date = new Date(todo.todo_duedate);
  var today = new Date();
  var overdue = false;
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);
  if (date < today) {
    $row.addClass('overdue');
  }
  if (todo.todo_complete){
    $completedButton.append('<span>&#x2713;</span>');
    $row.addClass('complete');
  } else {
    $completedButton.append('<span></span>');
  }
  $completedButton.data('id',todo.todo_id);
  $rowDiv.append($completedButton);
  $itemText = $('<div class="itemText"><span class="dueDate">Due: ' + date.toDateString() + '</span><br><span class="todoTextSpan">' + todo.todo_text+'</span></div>');
  $rowDiv.append($itemText);
  var $deleteButton = $('<button class="deleteBtn delete btn btn-danger">Delete</button>');
  var $confirmation = $('<div class="confirmationInterface row"><div>')
  $confirmation.append('Are you sure?<br>');
  $confirmDeleteBtn = $('<button class="confirmDelete btn btn-danger">DELETE</button>');
  $confirmDeleteBtn.data('id',todo.todo_id);
  $confirmation.append($confirmDeleteBtn);
  $confirmation.append('<button class="cancelDeleteBtn btn btn-primary">Cancel</button>');
  $confirmation.hide();
  $rowDiv.append($confirmation);
  $rowDiv.append($deleteButton);
  console.log($row);
  $row.append($rowDiv);
  if (id === todo.todo_id) {
    $row.hide();
  }
  $('#todoContainer').append($row);
}

// takes text input and transmits it to the server to be placed in the database.
// sends object {todo_text}. New todo is incomplete by default
function submitTodo(event){
  event.preventDefault();
  $('#todoIn').closest('div').removeClass('has-error');
  $('#dateIn').removeClass('redBorder');
  var todoText = $('#todoIn').val();
  var todoDueDate = $('#dateIn').val();
  console.log('todoDueDate',!todoDueDate);
  if (!todoText || !todoDueDate){
    if (!todoText) {
      $('#todoIn').closest('div').addClass('has-error');
    }
    if (!todoDueDate) {
      $('#dateIn').addClass('redBorder');
    }
  } else {
    var newTodo = {
      todo_text: todoText,
      todo_duedate: todoDueDate
    };
    console.log('Before POST', newTodo);
    $.ajax({
      method: 'POST',
      url: '/todo',
      data: newTodo
    })
    .done(function(response){
      console.log('POST successful. Status:',response);
      $('#todoIn').val('')
      refreshTodos(-1);
    })
    .fail(function(response){
      alert('POST failed! Status:',response);
    });
  }
}

function areYouSure(){
  $(this).hide();
  $(this).closest('.itemDiv').children('.confirmationInterface').show();
}

// sends a delete request for todo item associated with the clicked delete button
function deleteTodo(){
  var id = $(this).data('id');
  var $row = $(this).closest('li');
  console.log('Deleting item with id',id);
  $.ajax({
    method: 'DELETE',
    url: '/todo/'+ id
  })
  .done(function(response){
    console.log('Delete succeeded with response',response);
    $row.slideUp(200);
    setTimeout(refreshTodos,200,0);
  })
  .fail(function(response){
    alert('Delete failed with response',response);
  });
}

// toggles completion state of item associated with the complete button
function toggleComplete() {
  var id = $(this).data('id');
  var $row = $(this).closest('li');
  console.log('Toggling complete for',id);
  $.ajax({
    method: 'PUT',
    url: '/todo/'+id
  })
  .done(function(response){
    console.log('Toggle completed success');
    $row.slideUp(200);
    setTimeout(refreshTodos,200,id);
  })
  .fail(function(response){
    alert('Toggle completed failed',response)
  });
}