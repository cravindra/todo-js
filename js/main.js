import "bootstrap/dist/css/bootstrap.css"
import "../css/todo.css";
import "@fortawesome/fontawesome-free/css/all.css";

import "./vendor/jquery";
import "popper.js";
import "bootstrap/dist/js/bootstrap.js"


import Todo from "./todo";

const TodoController = new Todo('#todo-container');
window.TodoController = TodoController;