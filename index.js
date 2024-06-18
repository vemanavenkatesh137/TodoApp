// Select DOM elements
const newTaskInput = document.getElementById('new-task');
const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');
const streakPointsElement = document.getElementById('streak-points');

// Initialize state
let tasks = [];
let completedTasks = [];
let streakPoints = 0;

// Load tasks and streak points from local storage
function loadState() {
  const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
  const storedCompletedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
  const storedStreakPoints = JSON.parse(localStorage.getItem('streakPoints')) || 0;
  tasks = storedTasks;
  completedTasks = storedCompletedTasks;
  streakPoints = storedStreakPoints;
  renderTasks();
  renderCompletedTasks();
  updateStreakPoints();
}

// Save tasks, completed tasks, and streak points to local storage
function saveState() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  localStorage.setItem('streakPoints', JSON.stringify(streakPoints));
}

// Render the tasks to the DOM
function renderTasks() {
  todoList.innerHTML = '';
  tasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'todo-item';
    taskItem.innerHTML = `
      <span>${task.text}</span>
      <button onclick="completeTask(${index})">Complete</button>
      <button onclick="removeTask(${index})">Remove</button>
    `;
    todoList.appendChild(taskItem);
  });
}

// Render the completed tasks to the DOM
function renderCompletedTasks() {
  completedList.innerHTML = '';
  completedTasks.forEach((task, index) => {
    const taskItem = document.createElement('div');
    taskItem.className = 'todo-item completed';
    taskItem.innerHTML = `
      <span>${task.text}</span>
      <button onclick="undoCompleteTask(${index})">Undo</button>
    `;
    completedList.appendChild(taskItem);
  });

  // If there are completed tasks, show the "Clear All" button
  const clearAllButton = document.getElementById('clear-all');
  clearAllButton.style.display = completedTasks.length > 0 ? 'block' : 'none';
}

// Update the streak points display
function updateStreakPoints() {
  streakPointsElement.textContent = streakPoints;
}

// Add a new task
function addTask() {
  const taskText = newTaskInput.value.trim();
  if (taskText) {
    tasks.push({ text: taskText, completed: false });
    newTaskInput.value = '';
    saveState();
    renderTasks();
  }
}

// Mark task as completed and increase streak points
function completeTask(index) {
  const completedTask = tasks.splice(index, 1)[0];
  completedTask.completed = true;
  completedTasks.push(completedTask);
  streakPoints += 1;
  saveState();
  renderTasks();
  renderCompletedTasks();
  updateStreakPoints();
}

// Undo a completed task
function undoCompleteTask(index) {
  const taskToUndo = completedTasks.splice(index, 1)[0];
  taskToUndo.completed = false;
  tasks.push(taskToUndo);
  streakPoints = Math.max(0, streakPoints - 1);
  saveState();
  renderTasks();
  renderCompletedTasks();
  updateStreakPoints();
}

// Remove a task
function removeTask(index) {
  tasks.splice(index, 1);
  saveState();
  renderTasks();
}

// Clear all completed tasks
function clearAllCompletedTasks() {
  completedTasks = [];
  saveState();
  renderCompletedTasks();
}

// Initial load
loadState();
