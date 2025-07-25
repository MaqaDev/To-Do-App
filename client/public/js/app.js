const allTasks = document.querySelector(".allTasks");
let taskList = [];
let taskId = 0;

//  SAVE TASK function
function saveToLocal() {
  let tasks = JSON.stringify(taskList);
  localStorage.setItem("tasks", tasks);
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

async function renderTask() {
  try {
    const response = await fetch("/api/tasks");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const tasks = await response.json();
    const allTasks = document.querySelector(".allTasks");
    tasks.forEach((taskdata) => {
      const taskTemplate = document
        .querySelector(".taskTemplate")
        .cloneNode(true);
      const task = taskTemplate.content.querySelector(".task");
      const taskDoneInput = task.querySelector(".taskDoneInput");
      const taskDoneLabel = task.querySelector(".cbx");
      taskDoneInput.id = taskdata.taskId;
      taskDoneInput.checked = taskdata.checkStatus;
      taskDoneLabel.htmlFor = taskdata.taskId;
      task.dataset.id = taskdata.taskId;
      const taskName = task.querySelector(".taskName");
      taskName.textContent = taskdata.taskName;
      checkTaskStatus(taskDoneInput.checked, taskName);
      allTasks.appendChild(task);
    });
  } catch (error) {
    console.log("Error while render task: ", error);
  }
}
renderTask();

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
  console.log(!event.target.classList.contains("taskSearchBarInput"));
  if (!event.target.classList.contains("taskSearchBarInput")) {
    const taskSearchBarInput = document.querySelector(".taskSearchBarInput");
    taskSearchBarInput.value = "";
    const tasks = document.querySelectorAll(".task");
    tasks.forEach((task) => {
      task.style.display = "flex";
    });
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
      const taskId = Date.now() + Math.floor(Math.random());
      console.log(taskId);
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

// task delete event listener
allTasks.addEventListener("click", deleteTask);
async function deleteTask(event) {
  event.preventDefault();
  if (event.target.classList.contains("trashCan")) {
    const task = event.target.closest(".task");
    const id = task.dataset.id;
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    task.remove();
    if (!response.ok) {
      console.log(response.status);
    }
  }
}

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
allTasks.addEventListener("click", editTaskConfirm);
async function editTaskConfirm(event) {
  event.preventDefault();
  try {
    if (event.target.classList.contains("fa-check")) {
      const task = event.target.closest(".task");
      const taskName = task.querySelector(".taskName");
      const taskEditContent = task.querySelector(".taskEditContent");
      const taskEditInputBar = task.querySelector(".taskEditInputBar");
      taskName.textContent = taskEditInputBar.value;
      const reqObj = {
        taskName: taskEditInputBar.value,
      };
      const id = task.dataset.id;
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reqObj),
      });
      if (response.ok) {
        taskEditContent.style.display = "none";
      }
    }
  } catch (error) {
    console.log(error);
  }
}
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
allTasks.addEventListener("click", async (event) => {
  if (event.target.classList.contains("cbx")) {
    const task = event.target.closest(".task");
    const taskName = task.querySelector(".taskName");
    const checkBox = task.querySelector(".taskDoneInput");
    const checkIcon = task.querySelector(".cbx");
    const editPen = task.querySelector(".editPen");
    let checkStatus = !checkBox.checked;
    const id = task.dataset.id;
    resObj = {
      Completed: checkStatus,
    };
    const request = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resObj),
    };
    if (checkStatus) {
      checkBox.checked = true;
      checkStatus = true;
      taskName.classList.add("taskDoneLine");
      editPen.classList.add("editPenAnimation");
      checkIcon.classList.add("taskDoneAnimation");
    } else {
      checkBox.checked = false;
      checkStatus = false;
      // const response = await fetch(`/api/tasks/${id}`, request);
      taskName.style.textDecoration = "";
      taskName.classList.remove("taskDoneLine");
      editPen.classList.remove("editPenAnimation");
      checkIcon.classList.remove("taskDoneAnimation");
    }
    const response = await fetch(`/api/tasks/${id}`, request);
    if (!response.ok) {
      console.log(response.status);
    }
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
deleteAllConfirm.addEventListener("click", deleteAll);

async function deleteAll(event) {
  event.preventDefault();
  const response = await fetch(`/api/tasks`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  allTasks.innerHTML = "";
  deleteAllConfirmation.style.display = "none";
  if (!response.ok) {
    console.log(response.status);
  }
}

// Delete All Cancel
const deleteAllCancel = document.querySelector(".deleteAllCancel");
deleteAllCancel.addEventListener("click", () => {
  deleteAllConfirmation.style.display = "none";
});
// localStorage.clear();
