#TO-DO LIST APPLICATION
-----------------------

## Table and Example Data Creation
-----------------
```SQL
CREATE TABLE "todo_list" (
    "todo_id" serial PRIMARY KEY,
    "todo_text" varchar(500),
    "todo_complete" boolean NOT NULL DEFAULT 'false',
    "todo_duedate" text
);

INSERT INTO "todo_list" ("todo_text","todo_complete","todo_duedate") VALUES ('Complete weekend project 3','false','2017-10-23');
```

Requirements:

*Base Mode*
 - [X] Create a front end experience that allows a user to create a task.
 - [X] When the task is created, it should be stored inside of a database (SQL)
 - [X] Whenever a task is created the front end should refresh to show all tasks that need to be completed.
 - [X] Each task should have an option to 'Complete' or 'Delete'.
 - [X] When a task is complete, its visual representation should change on the front end (for example, the background of the task container could change from gray to green, as well as the complete option 'checked off'. Each of these are accomplished in CSS, but will need to hook into logic to know whether or not the task is complete)
 - [X] Whether or not a task is complete should also be stored in the database.
 - [X] Deleting a task should remove it both from the Front End as well as the Database.
 - [X] Style!

*Hard Mode*
 - [X] In whatever fashion you would like, create an 'are you sure: yes / no' option when deleting a task.
 - [X] Use jQuery to add animation to your page when you add or remove an item to the list.

 *Pro Mode*
 - [X] Publish your app to Heroku.
 - [X] Adjust the logic so that completed tasks are brought to the bottom of the page, where the remaining tasks left to complete are brought to the top of the list.
 - [X] Add a due date to your tasks and put the items which need to be completed next at the top of the page. Highlight overdue tasks in red.
 - [ ] Add any additional features that you think would be useful or interesting!
