console.log('js');
$(document).ready(main);

function main(){
  console.log('jQ');
  $('#todoForm').submit(submitTodo);
}

function submitTodo(event){
  event.preventDefault();
  

}