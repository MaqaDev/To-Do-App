const allTasks = document.querySelector(".allTasks");
let taskList = [];
let taskId = 0;

//  SAVE TASK function
function saveToLocal() {
  let tasks = JSON.stringify(taskList);
  localStorage.setItem("tasks", tasks);
}

// find task from save
function findTaskFromSave(task) {
  const taskId = task.dataset.id;
  let neededElement = taskList.find((taskObj) => {
    if (taskObj.id == taskId) {
      return taskObj;
    }
  });
  return neededElement;
}

// task Done changes
function checkTaskStatus(status, taskName) {
  if (status) {
    taskName.style.textDecoration = "line-through";
  } else {
    taskName.style.textDecoration = "";
  }
}

// task RENDER to page

function renderTasks() {
  const savedTasksStr = localStorage.getItem("tasks");
  const savedTasks = JSON.parse(savedTasksStr);
  taskList = savedTasks;
  if (!savedTasksStr || savedTasks.length == 0) return;

  const allTasks = document.querySelector(".allTasks");
  savedTasks.forEach((taskdata) => {
    const taskTemplate = document
      .querySelector(".taskTemplate")
      .cloneNode(true);
    const task = taskTemplate.content.querySelector(".task");
    const taskDoneInput = task.querySelector(".taskDoneInput");
    const taskDoneLabel = task.querySelector(".cbx");
    taskDoneInput.id = taskdata.id;
    taskDoneInput.checked = taskdata.checkStatus;
    taskDoneLabel.htmlFor = taskdata.id;
    task.dataset.id = taskdata.id;
    const taskName = task.querySelector(".taskName");
    taskName.textContent = taskdata.taskName;
    checkTaskStatus(taskDoneInput.checked, taskName);
    allTasks.appendChild(task);
  });
}
renderTasks();

// SEARCH TASK
const taskSearchBarInput = document.querySelector(".taskSearchBarInput");
const addTaskBtn = document.querySelector(".addTaskBtn");
function searchTask() {
  const searchKey = taskSearchBarInput.value.toLowerCase();
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    const taskName = task.querySelector(".taskName").textContent.toLowerCase();
    if (taskName.startsWith(searchKey)) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
}
taskSearchBarInput.addEventListener("input", searchTask);

// ADD TASK
const addTaskInputBar = document.querySelector(".addTaskInputBar");
function addTask() {
  const savedTasksStr = localStorage.getItem("tasks");
  const savedTasks = JSON.parse(savedTasksStr);
  if (!savedTasksStr || savedTasks.length == 0) {
    taskId = 0;
  } else {
    const lastId = savedTasks[savedTasks.length - 1].id;
    taskId = lastId + 1;
  }
  const allTasks = document.querySelector(".allTasks");
  const taskTemplate = document.querySelector(".taskTemplate").cloneNode(true);
  const task = taskTemplate.content.querySelector(".task");
  allTasks.append(task);
  task.querySelector(".taskName").textContent = addTaskInputBar.value;
  const taskName = addTaskInputBar.value;
  task.dataset.id = taskId;
  const taskObj = {
    id: taskId,
    taskName: taskName,
    checkStatus: false,
  };
  const taskDoneInput = task.querySelector(".taskDoneInput");
  const taskDoneLabel = task.querySelector(".cbx");
  taskDoneInput.id = taskId;
  taskDoneLabel.htmlFor = taskId;
  taskList.push(taskObj);
  addTaskInputBar.value = "";
  saveToLocal();
}
addTaskInputBar.value = "";
addTaskBtn.addEventListener("click", addTask);
addTaskInputBar.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    addTaskBtn.click();
  }
});

// task REMOVE event listener
allTasks.addEventListener("click", (event) => {
  if (event.target.classList.contains("trashCan")) {
    const task = event.target.closest(".task");
    const removeElement = findTaskFromSave(task);

    let index = taskList.indexOf(removeElement);
    console.log(taskList[index].taskName);
    taskList.splice(index, 1);
    saveToLocal();
    task.remove();
  }
});

// Task EDIT event listener
allTasks.addEventListener("click", (event) => {
  if (event.target.classList.contains("editPen")) {
    const task = event.target.closest(".task");
    const taskEditContent = task.querySelector(".taskEditContent");
    taskEditContent.style.display = "block";
    taskEditContent.classList.add("taskEditMainAnimation");
    const taskEditInputBar = task.querySelector(".taskEditInputBar");
    taskEditInputBar.value = task.querySelector(".taskName").textContent;
    taskEditInputBar.focus();
  }
});

// task edit CONFIRM event listener
allTasks.addEventListener("click", (event) => {
  if (event.target.classList.contains("fa-check")) {
    const task = event.target.closest(".task");
    const taskName = task.querySelector(".taskName");
    const taskEditContent = task.querySelector(".taskEditContent");
    const taskEditInputBar = task.querySelector(".taskEditInputBar");
    taskName.textContent = taskEditInputBar.value;

    const editedTask = findTaskFromSave(task);
    let index = taskList.indexOf(editedTask);
    console.log(taskList[index]);
    taskList[index].taskName = taskEditInputBar.value;
    saveToLocal();
    taskEditContent.style.display = "none";
  }
});
allTasks.addEventListener("keydown", (event) => {
  if (
    event.target.classList.contains("taskEditInputBar") &&
    event.key === "Enter"
  ) {
    const task = event.target.closest(".task");
    const icon = task.querySelector(".fa-check");
    icon.click();
  }
});

// task edit CANCEL event listener
allTasks.addEventListener("click", (event) => {
  if (event.target.classList.contains("fa-xmark")) {
    const task = event.target.closest(".task");
    const taskEditContent = task.querySelector(".taskEditContent");
    taskEditContent.style.display = "none";
  }
});
allTasks.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    const task = event.target.closest(".task");
    const cancelIcon = task.querySelector(".fa-xmark");
    cancelIcon.click();
  }
});

allTasks.addEventListener("click", (event) => {
  if (event.target.classList.contains("taskDoneInput")) {
    const task = event.target.closest(".task");
    const taskName = task.querySelector(".taskName");
    const checkBox = task.querySelector(".taskDoneInput");
    const checkIcon = task.querySelector(".cbx");
    const editPen = task.querySelector(".editPen");
    // const status = findTaskFromSave(task).checkStatus
    if (checkBox.checked) {
      findTaskFromSave(task).checkStatus = true;
      taskName.classList.add("taskDoneLine");
      editPen.classList.add("editPenAnimation");
      checkIcon.classList.add("taskDoneAnimation");
    } else {
      findTaskFromSave(task).checkStatus = false;
      taskName.style.textDecoration = "";
      taskName.classList.remove("taskDoneLine");
      editPen.classList.remove("editPenAnimation");
      checkIcon.classList.remove("taskDoneAnimation");
    }
    saveToLocal();
  }
});

// localStorage.clear();
