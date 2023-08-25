let addTaskButton = document.getElementById("add-task-button");
let taskNameInput = document.getElementById("input-task");
let taskListElement = document.getElementById("task-list");

class Task {
    constructor(
        id,
        description,
        completed = false
    ) {
        this.id = id;
        this.description = description;
        this.completed = completed;
    }
}

let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

let taskId = 0;
let findMaxId = Math.max(...taskList.map(task => task.id));

if (findMaxId !== -Infinity) {
    taskId = findMaxId;
}

addTaskButton.addEventListener("click", function () {
    addTask();
});

taskNameInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function renderList() {
    console.log(taskList);
    console.log(JSON.parse(
        localStorage.getItem("tasks")
    ));
    taskListElement.innerHTML = "";
    taskList.forEach(task => {
        let newTaskElement = document.createElement("li");

        newTaskElement.innerHTML = `
      <div class="checkbox-task">
        <input type="checkbox" id="${task.id}" name="checkbox" ${task.completed ? "checked" : ""}>
        <label for="${task.id}"></label>
        <span class="task">${task.description}</span>
      </div>
      <button class="delete-btn" type="button">
        <div class="closeModal"></div>
      </button>`;

        if (task.completed) {
            newTaskElement.classList.add("completed");
        } else {
            newTaskElement.classList.remove("completed");
        }

        taskListElement.appendChild(newTaskElement);
        taskNameInput.value = "";

        let inputCheckbox = newTaskElement.querySelector('[name="checkbox"]');
        inputCheckbox.addEventListener('click', function () {
            task.completed = inputCheckbox.checked;

            sortTaskList();
            saveTaskList();
            renderList();
        });

        let deleteButton = newTaskElement.querySelector(".delete-btn");
        deleteButton.addEventListener("click", function () {
            taskList = taskList.filter(taskToFilter => {
                return taskToFilter.id !== task.id;
            });
            saveTaskList();
            renderList();
        });
    });
}

function addTask() {
    let taskName = taskNameInput.value.trim();
    if (taskName !== "") {
        taskId++;
        taskList.push(new Task(taskId, taskName));
        sortTaskList();
        saveTaskList();
        renderList();
    }
}

function saveTaskList() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
}

function sortTaskList() {
    taskList.sort(
        (activeTask, completedTask) =>
            activeTask.completed - completedTask.completed
    );
}

renderList();