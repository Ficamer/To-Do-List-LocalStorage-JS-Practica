// Primer paso, traer los elementos necesarios del HTML
const input = document.querySelector(".input-text");
const addForm = document.querySelector(".add-form");
const taskList = document.querySelector(".tasks-list");
const deleteBtn = document.querySelector(".deleteAll-btn");

// Definimos la lista de tareas. (Array vacio)
let tasks = JSON.parse(localStorage.getItem('tasks')) || []; //Dos opciones, o me traes lo que esta en el localStorage (convierto lo del localStorage a array con parse) o me creas un array vacio.

// Creamos la funcion para no mostrar el boton de borrar todas las tareas si no hay tareas
const mostrarBoton = (tareas) =>{
    if (tareas.length === 0){
        deleteBtn.style.display="none";
    }else {
        deleteBtn.style.display="flex";
    }
}
//Creamos la funcion para guardar las tareas en el localStorage.
const saveLocalStorage = tasksList => {
    localStorage.setItem('tasks', JSON.stringify(tasksList)); 
    //Creamos una clave tasks para guardar los valores de la lista de tareas en forma de JSON.
}

// Funcion para borrar todas las tareas
const borrarTodasTareas = ()=> {
 
    tasks = [];
    taskList.innerHTML = "";
    deleteBtn.style.display="none";
    saveLocalStorage(tasks); //Actualizamos el storage
};

//Creamos la funcion para borrar una tarea
const removeTask = e => {
    if (!e.target.classList.contains('delete-btn')) return;  //Target identifica que se clickea, classList.contains identifica si tiene esa clase o no, 
         // en otras palabras la condicion que pusimos significa que si clickeo y lo que clickeo no tiene la clase que le marque, no haga nada                                         
    const filterId = Number(e.target.dataset.id); //Guardamos el dataset en filterId, tenemos que transformar el dataset a un numero con number o parseInt.
    tasks = tasks.filter(task => task.taskId != filterId); //Creamos un nuevo arreglo que cumpla que el task.taskId sea distinto al filterId es decir al Id del elemento que estoy borrando.
    renderTasksList(tasks); //Volvemos a dibujar
    saveLocalStorage(tasks); //Actualizamos las tareas
    mostrarBoton(tasks);
}



// Funcion para tener el HTML a crear de la tarea
const createTask = task => {
    return `<li>${task.name}<img class="delete-btn" src="./img/eliminar.png" data-id="${task.taskId}"/></li>`;
}

// Creemos la logica de renderizacion de la lista de tareas.
const renderTasksList = todoList => { //Render es un nombre que se refiere a "pintar"
    taskList.innerHTML = todoList.map(task => createTask(task)).join('');//Con el metodo .join('') hago que el separador sea vacio, o sea que no haya separador.
    //Map crea un nuevo array en el que a cada elemento se le asigna una funcion.
}

// Funcion para agregar tareas
const addTask = e => { //El problema del submit de html, es que recarga la pagina al ser ejecutado, 
    //eso se evita con prevent default, El método preventDefault() forma parte de los objetos evento de Javascript y sirve, como su nombre indica, para prevenir el comportamiento por defecto de un evento.
    e.preventDefault(); //La e representa al evento
    // Guarda en una variable la tarea que ingresemos en el input.
    const taskName = input.value.trim(); //Usamos el metodo trim para eliminar los espacios iniciales y finales (no los espacios entre letras)
    console.log(taskName);

    //Damos una alerta si no hay valores ingresados en el input (o sea, si no estoy escribiendo nada)
    if(taskName.length === 0) { 
        alert('Por favor, ingresa una tarea')
        return; //Que se deje de ejecutar.
    }else if(tasks.some(task => task.name.toLowerCase() === taskName.toLowerCase())){ //Comparamos los nombres del array de tareas, con el del input los pasamos a minusculas para comparar.
        alert('Ya existe una tarea con ese nombre');
        input.value ='';
        return;
    }else if(taskName.length >= 45){
        alert('El nombre de la tarea excede el limite de caracteres');
        input.value ='';
        return;
    }
    //Modifico el array vacio y lo relleno con un objeto que contiene nombre y ID, al id le sumo 1 a length dado a que comienza en 0.
    tasks = [...tasks,{name: taskName, taskId: tasks.length + 1}];
    console.log(tasks);
    //Hago que cuando se envia el input se borre lo escrito en el input anteriormente.
    input.value ='';
    renderTasksList(tasks);
    saveLocalStorage(tasks);
    mostrarBoton(tasks);
}

//Vamos a crear una unica funcion que va a tener todas las funciones.
const init = () => {
    //Vamos a dibujar las tareas si es que las hay por el localstorage
    renderTasksList(tasks);
    //Vamos a escuchar los eventos
    addForm.addEventListener('submit', addTask);
    deleteBtn.addEventListener('click', borrarTodasTareas);
    taskList.addEventListener('click', removeTask);
    //Si no hay tareas, no mostrar el boton borrar todo
    mostrarBoton(tasks);

};

init();



