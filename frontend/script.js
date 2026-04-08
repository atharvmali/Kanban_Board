const API_BASE_URL =
  window.location.protocol === "file:" ? "http://localhost:5050/api" : `${window.location.origin}/api`;
const TOKEN_KEY = "kanban_token";
const USER_KEY = "kanban_user";

const boardSelect = document.getElementById("boardSelect");
const addBoardBtn = document.getElementById("addBoardBtn");
const renameBoardBtn = document.getElementById("renameBoardBtn");
const deleteBoardBtn = document.getElementById("deleteBoardBtn");
const logoutBtn = document.getElementById("logoutBtn");
const addColumnBtn = document.getElementById("addColumnBtn");
const statusText = document.getElementById("statusText");
const welcomeText = document.getElementById("welcomeText");
const columnsContainer = document.getElementById("columnsContainer");

const columnTemplate = document.getElementById("columnTemplate");
const taskTemplate = document.getElementById("taskTemplate");

let boards = [];
let activeBoardId = null;

async function request(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  });

  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "login.html";
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    let message = "Request failed";
    try {
      const data = await response.json();
      message = data.message || message;
    } catch (error) {
      // Keep fallback message if server does not return JSON.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function setStatus(message) {
  statusText.textContent = message;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

async function loadBoards() {
  setStatus("Loading boards...");
  boards = await request("/boards");

  if (!boards.length) {
    const starterBoard = await request("/boards", {
      method: "POST",
      body: JSON.stringify({ name: "My First Board" })
    });

    // Create default columns so first-time users can start immediately.
    await request(`/boards/${starterBoard._id}/columns`, {
      method: "POST",
      body: JSON.stringify({ title: "Todo" })
    });
    await request(`/boards/${starterBoard._id}/columns`, {
      method: "POST",
      body: JSON.stringify({ title: "In Progress" })
    });
    await request(`/boards/${starterBoard._id}/columns`, {
      method: "POST",
      body: JSON.stringify({ title: "Done" })
    });

    boards = await request("/boards");
  }

  activeBoardId = boards.length ? boards[0]._id : null;
  renderBoardSelect();
  if (activeBoardId) {
    await loadActiveBoard();
  } else {
    renderColumns([]);
    setStatus("Create your first board to get started.");
  }
}

function renderBoardSelect() {
  boardSelect.innerHTML = "";

  boards.forEach((board) => {
    const option = document.createElement("option");
    option.value = board._id;
    option.textContent = board.name;
    if (board._id === activeBoardId) {
      option.selected = true;
    }
    boardSelect.appendChild(option);
  });
}

function renderWelcome() {
  try {
    const userData = JSON.parse(localStorage.getItem(USER_KEY) || "{}");
    if (userData.name) {
      welcomeText.textContent = `Welcome, ${userData.name}. Your boards are private to your account.`;
    }
  } catch (error) {
    welcomeText.textContent = "Plan work visually, move tasks with drag-and-drop.";
  }
}

async function loadActiveBoard() {
  if (!activeBoardId) {
    columnsContainer.innerHTML = "";
    return;
  }

  setStatus("Loading board details...");
  const board = await request(`/boards/${activeBoardId}`);
  renderColumns(board.columns || []);
  setStatus(`Viewing board: ${board.name}`);
}

function renderColumns(columns) {
  columnsContainer.innerHTML = "";

  columns.forEach((column) => {
    const columnNode = columnTemplate.content.firstElementChild.cloneNode(true);
    const titleNode = columnNode.querySelector("h2");
    const taskListNode = columnNode.querySelector(".task-list");
    const editColumnBtn = columnNode.querySelector(".edit-column");
    const deleteColumnBtn = columnNode.querySelector(".delete-column");
    const addTaskBtn = columnNode.querySelector(".add-task-btn");

    titleNode.textContent = column.title;
    columnNode.dataset.columnId = column._id;

    setupDropZone(taskListNode, column._id);

    (column.tasks || []).forEach((task) => {
      taskListNode.appendChild(createTaskNode(task));
    });

    editColumnBtn.addEventListener("click", () => editColumn(column));
    deleteColumnBtn.addEventListener("click", () => deleteColumn(column));
    addTaskBtn.addEventListener("click", () => addTask(column._id));

    columnsContainer.appendChild(columnNode);
  });
}

function createTaskNode(task) {
  const taskNode = taskTemplate.content.firstElementChild.cloneNode(true);
  taskNode.dataset.taskId = task._id;

  taskNode.querySelector("h3").textContent = task.title;
  taskNode.querySelector(".task-description").textContent = task.description || "No description";
  taskNode.querySelector(".task-date").textContent = `Created: ${formatDate(task.createdDate)}`;

  const editTaskBtn = taskNode.querySelector(".edit-task");
  const deleteTaskBtn = taskNode.querySelector(".delete-task");

  editTaskBtn.addEventListener("click", () => editTask(task));
  deleteTaskBtn.addEventListener("click", () => deleteTask(task._id));

  taskNode.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", task._id);
    event.dataTransfer.effectAllowed = "move";
  });

  return taskNode;
}

function setupDropZone(taskListNode, columnId) {
  taskListNode.addEventListener("dragover", (event) => {
    event.preventDefault();
    taskListNode.classList.add("drag-over");
  });

  taskListNode.addEventListener("dragleave", () => {
    taskListNode.classList.remove("drag-over");
  });

  taskListNode.addEventListener("drop", async (event) => {
    event.preventDefault();
    taskListNode.classList.remove("drag-over");

    const taskId = event.dataTransfer.getData("text/plain");
    if (!taskId) {
      return;
    }

    try {
      await request(`/tasks/${taskId}/move`, {
        method: "PATCH",
        body: JSON.stringify({ targetColumnId: columnId })
      });
      await loadActiveBoard();
    } catch (error) {
      alert(`Failed to move task: ${error.message}`);
    }
  });
}

async function addBoard() {
  const name = prompt("Board name:");
  if (!name) {
    return;
  }

  await request("/boards", {
    method: "POST",
    body: JSON.stringify({ name })
  });

  boards = await request("/boards");
  activeBoardId = boards[0]._id;
  renderBoardSelect();
  await loadActiveBoard();
}

async function renameBoard() {
  const current = boards.find((board) => board._id === activeBoardId);
  if (!current) {
    return;
  }

  const name = prompt("New board name:", current.name);
  if (!name) {
    return;
  }

  await request(`/boards/${activeBoardId}`, {
    method: "PUT",
    body: JSON.stringify({ name })
  });

  boards = await request("/boards");
  renderBoardSelect();
  await loadActiveBoard();
}

async function deleteBoard() {
  if (!activeBoardId) {
    return;
  }

  const confirmed = confirm("Delete this board and all its columns/tasks?");
  if (!confirmed) {
    return;
  }

  await request(`/boards/${activeBoardId}`, {
    method: "DELETE"
  });

  await loadBoards();
}

async function addColumn() {
  const title = prompt("Column title:");
  if (!title || !activeBoardId) {
    return;
  }

  await request(`/boards/${activeBoardId}/columns`, {
    method: "POST",
    body: JSON.stringify({ title })
  });

  await loadActiveBoard();
}

async function editColumn(column) {
  const title = prompt("Edit column title:", column.title);
  if (!title) {
    return;
  }

  await request(`/columns/${column._id}`, {
    method: "PUT",
    body: JSON.stringify({ title })
  });

  await loadActiveBoard();
}

async function deleteColumn(column) {
  const confirmed = confirm(`Delete column "${column.title}" and all tasks in it?`);
  if (!confirmed) {
    return;
  }

  await request(`/columns/${column._id}`, {
    method: "DELETE"
  });

  await loadActiveBoard();
}

async function addTask(columnId) {
  const title = prompt("Task title:");
  if (!title) {
    return;
  }

  const description = prompt("Task description:") || "";

  await request(`/columns/${columnId}/tasks`, {
    method: "POST",
    body: JSON.stringify({ title, description })
  });

  await loadActiveBoard();
}

async function editTask(task) {
  const title = prompt("Edit task title:", task.title);
  if (!title) {
    return;
  }

  const description = prompt("Edit description:", task.description || "") || "";

  await request(`/tasks/${task._id}`, {
    method: "PUT",
    body: JSON.stringify({ title, description })
  });

  await loadActiveBoard();
}

async function deleteTask(taskId) {
  const confirmed = confirm("Delete this task?");
  if (!confirmed) {
    return;
  }

  await request(`/tasks/${taskId}`, {
    method: "DELETE"
  });

  await loadActiveBoard();
}

function registerEvents() {
  boardSelect.addEventListener("change", async (event) => {
    activeBoardId = event.target.value;
    await loadActiveBoard();
  });

  addBoardBtn.addEventListener("click", () => handleAction(addBoard));
  renameBoardBtn.addEventListener("click", () => handleAction(renameBoard));
  deleteBoardBtn.addEventListener("click", () => handleAction(deleteBoard));
  addColumnBtn.addEventListener("click", () => handleAction(addColumn));
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "login.html";
  });
}

async function handleAction(action) {
  try {
    await action();
  } catch (error) {
    alert(error.message);
    setStatus(`Error: ${error.message}`);
  }
}

(async function init() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.href = "login.html";
    return;
  }

  renderWelcome();
  registerEvents();
  try {
    await loadBoards();
  } catch (error) {
    setStatus(`Failed to load data: ${error.message}`);
  }
})();
