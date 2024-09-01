document.addEventListener("DOMContentLoaded", function () {
  function toggleTheme() {
    const body = document.body;
    body.classList.toggle("dark-theme");
    body.classList.toggle("light-theme");

    const themeIcon = document.querySelector("#themeToggle i");
    if (body.classList.contains("dark-theme")) {
      themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
      themeIcon.classList.replace("fa-sun", "fa-moon");
    }
  }

  // Default to light theme
  document.body.classList.add("dark-theme");

  document.getElementById("themeToggle").addEventListener("click", toggleTheme);

  function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const error = document.getElementById("error");

    if (taskInput.value === "") {
      error.innerText = "Task cannot be empty";
      return;
    }

    const task = document.createElement("li");
    const taskText = document.createElement("span");
    taskText.innerText = taskInput.value;
    task.className = "task-item";

    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.addEventListener("change", toggleComplete);

    task.appendChild(completeCheckbox);
    task.appendChild(taskText);
    taskList.appendChild(task);

    taskInput.value = "";
    error.innerText = ""; // Clear error message after adding task
  }

  function toggleComplete(event) {
    const checkbox = event.target;
    const task = checkbox.parentNode;
    if (checkbox.checked) {
      task.classList.add("completed");
    } else {
      task.classList.remove("completed");
    }
  }

  document.querySelector(".addTask").addEventListener("click", addTask);
});
