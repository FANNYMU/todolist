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

  // Load tasks from localStorage on page load
  loadTasks();

  function addTask() {
    const taskInput = document.getElementById("taskInput");
    const taskList = document.getElementById("taskList");
    const error = document.getElementById("error");

    if (taskInput.value === "") {
      error.innerText = "Task cannot be empty";
      return;
    }

    // Retrieve existing tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Add the new task to the tasks array
    tasks.push({ text: taskInput.value, completed: false });

    // Save the updated tasks array back to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Create a new task element
    createTaskElement(taskInput.value, tasks.length - 1, false);

    taskInput.value = "";
    error.innerText = ""; // Clear error message after adding task
  }

  function createTaskElement(taskText, taskIndex, completed) {
    const taskList = document.getElementById("taskList");
    const task = document.createElement("li");
    const taskTextSpan = document.createElement("span");
    taskTextSpan.innerText = taskText;
    task.className = "task-item";

    const completeCheckbox = document.createElement("input");
    completeCheckbox.type = "checkbox";
    completeCheckbox.checked = completed; // Set checkbox state based on the task's completion status
    completeCheckbox.addEventListener("change", function () {
      toggleComplete(completeCheckbox, taskIndex);
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", function () {
      deleteTask(taskIndex, task);
    });

    if (completed) {
      task.classList.add("completed"); // Mark task as completed in the UI
    }

    task.appendChild(completeCheckbox);
    task.appendChild(taskTextSpan);
    task.appendChild(deleteButton);
    taskList.appendChild(task);
  }

  function loadTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = ""; // Clear existing tasks
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task, index) => {
      createTaskElement(task.text, index, task.completed); // Pass completed status to createTaskElement
    });
  }

  function toggleComplete(checkbox, taskIndex) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Update the completed status in the tasks array
    tasks[taskIndex].completed = checkbox.checked;

    // Save the updated tasks array back to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Update the UI class based on the checkbox state
    const task = checkbox.parentNode;
    if (checkbox.checked) {
      task.classList.add("completed");
    } else {
      task.classList.remove("completed");
    }
  }

  function deleteTask(taskIndex, taskElement) {
    // Retrieve existing tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    // Remove the task from the array
    tasks.splice(taskIndex, 1);

    // Save the updated tasks array back to localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Remove the task from the UI immediately
    taskElement.remove();

    // Update the task list to reflect the remaining tasks
    loadTasks();
  }

  document.querySelector(".addTask").addEventListener("click", addTask);
});
