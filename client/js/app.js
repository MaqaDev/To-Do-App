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
  if (!savedTasksStr || savedTasks.length == 0) return;
  taskList = savedTasks;
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

// Serch Button Click Animation
const body = document.getElementById("body");
const searchIcon = document.querySelector(".searchIcon");
const taskSearchBar = document.querySelector(".taskSearchBar");
const taskMainHeaderText = document.querySelector(".tasksMainHeaderText");
searchIcon.addEventListener("click", () => {
  body.removeEventListener("click", searchRequire);
  taskMainHeaderText.style.display = "none";
  searchIcon.style.display = "none";
  taskSearchBar.classList.add("taskSearchBarAnimation");
  setTimeout(() => {
    body.addEventListener("click", searchRequire);
  }, 100);
});

function searchRequire(event) {
  if (taskSearchBar.classList.contains("taskSearchBarAnimation")) {
    console.log(event.target);
    taskMainHeaderText.style.display = "block";
    searchIcon.style.display = "block";
    taskSearchBar.classList.remove("taskSearchBarAnimation");
  }
}
// SEARCH TASK
const taskSearchBarInput = document.querySelector(".taskSearchBarInput");
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
const addTaskBtn = document.querySelector(".addTaskBtn");
const addTaskInputBar = document.querySelector(".addTaskInputBar");
const addTask = async function (event) {
  event.preventDefault();
  try {
    if (addTaskInputBar.value.trim() == "") {
      const emptyTask = document.querySelector(".emptyTask");
      emptyTask.style.display = "block";
      setTimeout(() => {
        emptyTask.style.display = "none";
      }, 4000);
    } else {
      const allTasks = document.querySelector(".allTasks");
      const taskTemplate = document
        .querySelector(".taskTemplate")
        .cloneNode(true);
      const task = taskTemplate.content.querySelector(".task");
      allTasks.append(task);
      task.querySelector(".taskName").textContent = addTaskInputBar.value;
      const taskName = addTaskInputBar.value;
      const taskId = 103;
      task.dataset.id = taskId;
      const taskObj = {
        taskId: taskId,
        taskName: taskName,
        Completed: false,
      };
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskObj),
      });
      if (response.ok) {
        console.log("Task Added");
        addTaskInputBar.value = "";
      }
    }
  } catch (error) {
    console.log(error);
  }
};
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

// task CHECKBOX event listener
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

// Delete All event listener
const deleteAllBtn = document.querySelector(".deleteAllBtn");
const deleteAllConfirmation = document.querySelector(".deleteAllConfirmation");
deleteAllBtn.addEventListener("click", () => {
  if (allTasks.innerHTML != "") {
    deleteAllConfirmation.style.display = "block";
  } else {
    deleteAllBtn.innerHTML = "You need to add task first !";
    deleteAllBtn.classList.add("textOppacity");
    deleteAllBtn.classList.remove("textOppacity2");
    setTimeout(() => {
      deleteAllBtn.innerHTML = "Delete All";
      deleteAllBtn.classList.remove("textOppacity");
      deleteAllBtn.classList.add("textOppacity2");
    }, 2000);
  }
});

// Delete All CONFIRM
const deleteAllConfirm = document.querySelector(".deleteAllConfirm");
deleteAllConfirm.addEventListener("click", () => {
  allTasks.innerHTML = "";
  localStorage.clear();
  deleteAllConfirmation.style.display = "none";
});

// Delete All Cancel
const deleteAllCancel = document.querySelector(".deleteAllCancel");
deleteAllCancel.addEventListener("click", () => {
  deleteAllConfirmation.style.display = "none";
});
// localStorage.clear();
