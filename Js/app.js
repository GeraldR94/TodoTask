//selectores y variables
const toDoContainer = document.querySelector('#toDoApp');
const formInput = document.querySelector('#newTask');
const form = document.querySelector('.form-container');
const formBox = document.querySelector('#form-box');
const formBtn = document.querySelector('#form-box button[type="submit"]');
const taskContainer = document.querySelector('#task-container');
const indicadores = document.querySelector('#indicadores-container');
const taskTotales = document.querySelector('.task-all span');
const taskActive = document.querySelector('.task-active span');
const taskCompleted = document.querySelector('.task-completed span');


let tasksArray = [];



//eventos

document.addEventListener('DOMContentLoaded', () => {
    // revisa el lS y obtiene la info, en caso de no ahber nada, retorna un array vacio
    tasksArray = JSON.parse(localStorage.getItem('tasks')) || [];

    imprimirHTML(tasksArray);
})
formInput.addEventListener('input', obtenerTask);
formBox.addEventListener('submit', aggTask);
taskActive.parentElement.addEventListener('click', taskActivas);
taskCompleted.parentElement.addEventListener('click', taskCompletadas);
taskTotales.parentElement.addEventListener('click', taskAll);


//funciones

function obtenerTask(e) {
    //obtiene la informacion escrita quitando espacios en blanco
    const contenido = e.target.value.trim();

    if(!contenido){
        // en caso de haber espacios vacios arrojara error
        mostrarAlerta('Por favor, agregue una tarea', 'error');
        form.reset()
        formBtn.disabled = true;
        return;
    }
    // si se obtuvo el texto y no son espacios vacios habilitara el btn
    formBtn.disabled = false;

}

function aggTask(e) {
    // detiene la accion por defecto
    e.preventDefault();
    
    //tomamos la informacion escrita en el input
    const task = formInput.value;

    //creamos un objeto con esa informacion
    const taskObj = {
        tarea: task,
        id: Date.now(),
        completado: false
    }

    // loa gregamos al array
    tasksArray = [...tasksArray, taskObj];
    

    imprimirHTML(tasksArray);

    mostrarAlerta('Tarea agregada exitosamente');

    // se desablita el btn una vez se ha agregado la tarea
    formBtn.disabled = true;

    //resetemos el input para poder ingresar facilmente mas tareas
    form.reset();

    
    
}
function taskActivas(e) {
    e.preventDefault();

    taskActive.parentElement.classList.add('active');
    taskCompleted.parentElement.classList.remove('active');
    taskTotales.parentElement.classList.remove('active');

    const tareasPendiente = tasksArray.filter(task => task.completado === false);
    imprimirHTML(tareasPendiente);
}
function taskCompletadas(e) {
    e.preventDefault();

    taskCompleted.parentElement.classList.add('active');
    taskActive.parentElement.classList.remove('active');
    taskTotales.parentElement.classList.remove('active');
    const tareasCompletadas = tasksArray.filter(task => task.completado === true);
    imprimirHTML(tareasCompletadas);
}
function taskAll(e) {
    e.preventDefault();

    taskTotales.parentElement.classList.add('active');
    taskActive.parentElement.classList.remove('active');
    taskCompleted.parentElement.classList.remove('active');
    
    imprimirHTML(tasksArray);
}
function mostrarAlerta(mensaje, tipo) {

    limpiarAlerta();
    
    const divAlerta = document.createElement('div');
    divAlerta.classList.add('alerta');

     if(tipo === 'error'){
        divAlerta.classList.add('error');
    }else{
        divAlerta.classList.add('exito');
    }

    divAlerta.textContent = mensaje;

    toDoContainer.insertBefore(divAlerta, formBox)

    

    setTimeout(() => {
        divAlerta.remove()
    }, 3000);

}

function limpiarAlerta() {
    
    const alertaExistente = document.querySelector('.alerta');
    
    if (alertaExistente) {
        alertaExistente.remove();
    }
    
}

function sincronizarStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasksArray))
}

function imprimirHTML(array) {
    limpiarHTML();

    // recorremos cada elemento del array en caso de haber alguno o mas

    if (array.length > 0) {
        // se hace una desestructuracion del objeto para poder usar su informacion en el scripting de manera mas facil
        array.forEach( ({tarea, id, completado})=> {

            // creamos nuestros elementos HTML
            const li = document.createElement('li');
            const btnEliminar = document.createElement('button');
            const parrafo = document.createElement('p');
            const btnRdy = document.createElement('button');

            // agregamos la inforamcion que contendran tanto como clases o codigo HTML en general
            li.classList.add('list-item');
            btnEliminar.innerHTML = `
            <svg width="512" height="512" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ef4444" fill-opacity=".15" d="M292.7 840h438.6l24.2-512h-487z"/>
            <path fill="#ef4444" d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-504-72h304v72H360v-72zm371.3 656H292.7l-24.2-512h487l-24.2 512z"/>
            </svg>
            `;
            
            // al detectar click en un elemento especifico eliminara dicho elemento
            btnEliminar.onclick = () =>{
                eliminarTask(id)
            }

            // agregamos el mensaje
            parrafo.textContent = tarea;
            
            btnRdy.innerHTML = `
            <svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 1 18 0a9 9 0 0 1-18 0Z"/>
            </svg>
            `;
            
            //esta valdiadcion es para cuando se refresque la pagina y traiga la info de lS, agregre las clases y elementos correspondientes segun el estatus del objeto.
            if(completado){
                li.classList.add('tachado');
                btnRdy.innerHTML = `
                        <svg width="512" height="512" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#84cc16" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"/>
                        <path fill="#84cc16" fill-opacity=".15" d="M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372s372-166.6 372-372s-166.6-372-372-372zm193.4 225.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.3 0 19.9 5 25.9 13.3l71.2 98.8l157.2-218c6-8.4 15.7-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.4 12.7z"/>
                        <path fill="#84cc16" d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"/>
                    </svg>
                `;
            }

            // nos permite que podamos colcoar un tarea como realizada, mediantes unas valdiadciones y dependiendo de ellas agregar o quitar
            btnRdy.onclick = () =>{
                    
                    if (!completado) {
                        // Cambiar SVG y agregar una clase
                        btnRdy.innerHTML = `
                        <svg width="512" height="512" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#84cc16" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"/>
                        <path fill="#84cc16" fill-opacity=".15" d="M512 140c-205.4 0-372 166.6-372 372s166.6 372 372 372s372-166.6 372-372s-166.6-372-372-372zm193.4 225.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.3 0 19.9 5 25.9 13.3l71.2 98.8l157.2-218c6-8.4 15.7-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.4 12.7z"/>
                        <path fill="#84cc16" d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0 0 51.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"/>
                    </svg>
                    `;
                    li.classList.add('tachado');

                    // Marcar la tarea como modificada
                    completado = true;

                }else {
                    // Revertir SVG y quitar la clase
                    btnRdy.innerHTML = `
                    <svg width="512" height="512" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12a9 9 0 1 1 18 0a9 9 0 0 1-18 0Z"/>
                    </svg>
                    `;
                    li.classList.remove('tachado');
                    
                    // Marcar la tarea como no modificada
                    completado = false;
                }

                // se actualiza la info del objeto

                const taskObj = {
                    tarea: tarea,
                    id: id,
                    completado: completado
                }

                // ubicamos nuestro objeto en el array y lo asignamos a index
                const index = array.findIndex(t => t.id === id); 
                
                // aca actualizamos el objeto en el array
                if (index !== -1) { 
                    array[index] = taskObj; 
                } 
                
                // y actualizmaos el lS
                sincronizarStorage();
                indicadorTareas();
            }

            // organizamos nuestro elemento y lo colocamos en su destino
            li.appendChild(btnEliminar);
            li.appendChild(parrafo);
            li.appendChild(btnRdy);

            taskContainer.appendChild(li);

        });
    }
    sincronizarStorage();
    indicadorTareas();
}

function limpiarHTML() {
    while (taskContainer.firstChild) {
        taskContainer.removeChild(taskContainer.firstChild);
    }
}

function eliminarTask(id) {
    tasksArray = tasksArray.filter( task => task.id !== id);
    imprimirHTML(tasksArray);
}

function indicadorTareas() {
    const tareasTotales = tasksArray.length;
    const tareasPendiente = tasksArray.filter(task => task.completado === false).length;
    const tareasCompletadas = tasksArray.filter(task => task.completado === true).length;

    taskTotales.innerHTML = tareasTotales;
    taskActive.innerHTML = tareasPendiente;
    taskCompleted.innerHTML = tareasCompletadas;
    
}

