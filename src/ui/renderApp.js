import { ProjectService } from "../services/projectService.js";
import { TaskService } from "../services/taskService.js";
import pencilIcon from "../assets/pen-to-square-regular.svg";
import trashcanIcon from "../assets/trash-can-regular.svg";
import checkIcon from "../assets/square-check-regular.svg";

// Instantiate services
const projectService = new ProjectService();
const taskService = new TaskService();

// Variable to track active project
let currentProjectId = null;
let currentTaskId = null;

// DOM Elements
const elements = {
  // Project elements
  contentProjects: document.getElementById("content-projects"),
  addProjectModal: document.getElementById("add-project-modal"),
  editProjectModal: document.getElementById("edit-project-modal"),
  addProjectForm: document.getElementById("add-project-form"),
  editProjectForm: document.getElementById("edit-project-form"),
  addProjectButton: document.getElementById("button-project-add"),
  closeAddProjectModalButton: document.querySelector(
    "#add-project-modal .close"
  ),
  closeEditProjectModalButton: document.querySelector(
    "#edit-project-modal .close"
  ),

  // Task elements
  contentTasks: document.getElementById("content-tasks"),
  addTaskModal: document.getElementById("add-task-modal"),
  editTaskModal: document.getElementById("edit-task-modal"),
  addTaskForm: document.getElementById("add-task-form"),
  editTaskForm: document.getElementById("edit-task-form"),
  addTaskButton: document.getElementById("button-task-add"),
  closeAddTaskModalButton: document.querySelector("#add-task-modal .close"),
  closeEditTaskModalButton: document.querySelector("#edit-task-modal .close"),
};

// Project Edit Modal Fields
const editProjectFields = {
  name: document.getElementById("edit-project-name"),
  description: document.getElementById("edit-project-description"),
  date: document.getElementById("edit-project-date"),
  priority: document.getElementById("edit-project-priority"),
};

// Task Edit Modal Fields
const editTaskFields = {
  name: document.getElementById("edit-task-name"),
  description: document.getElementById("edit-task-description"),
  date: document.getElementById("edit-task-date"),
  priority: document.getElementById("edit-task-priority"),
};

// MODAL HANDLERS
function toggleModal(modal, show) {
  modal.style.display = show ? "block" : "none";
  if (show) {
    const input = modal.querySelector("input, textarea, select");
    if (input) input.focus();
  }
}

function showDeleteConfirmationModal(project) {
  // Create the modal elements dynamically
  const modal = document.createElement("div");
  modal.classList.add("delete-modal");
  modal.innerHTML = `
    <div class="delete-modal-content">
      <h3>Are you sure you want to delete "${project.title}"?</h3>
      <div class="delete-modal-buttons">
        <button class="delete-confirm-btn">Yes, delete</button>
        <button class="delete-cancel-btn">Cancel</button>
      </div>
    </div>
  `;

  // Append the modal to the body
  document.body.appendChild(modal);

  // Event listener for the "Yes, delete" button
  const confirmBtn = modal.querySelector(".delete-confirm-btn");
  confirmBtn.addEventListener("click", () => {
    // Perform the deletion
    projectService.deleteProject(project.id);
    project.tasks.forEach((taskId) => {
      taskService.deleteTask(taskId);
    });
    renderProjects(); // Re-render projects after deletion
    closeModal(modal); // Close the modal
  });

  // Event listener for the "Cancel" button
  const cancelBtn = modal.querySelector(".delete-cancel-btn");
  cancelBtn.addEventListener("click", () => {
    closeModal(modal); // Close the modal if canceled
  });
}

//===============================================================================================
//-------------------------------------------FUNCTIONS-------------------------------------------
//===============================================================================================

// OPEN EDIT PROJECT MODAL
function openEditProjectModal(project) {
  currentProjectId = project.id;
  editProjectFields.name.value = project.title;
  editProjectFields.description.value = project.description || "";
  editProjectFields.date.value = project.dueDate || "";
  editProjectFields.priority.value = project.priority || "medium";
  toggleModal(elements.editProjectModal, true);
}

// OPEN EDIT TASK MODAL
function openEditTaskModal(task) {
  currentTaskId = task.id;
  editTaskFields.name.value = task.title;
  editTaskFields.description.value = task.description || "";
  editTaskFields.date.value = task.dueDate || "";
  editTaskFields.priority.value = task.priority || "medium";
  toggleModal(elements.editTaskModal, true);
}

// RENDER PROJECTS AND ITS TASKS
function renderProjects() {
  elements.contentProjects.innerHTML = ""; // Clear previous content

  const projects = projectService.getProjects();
  if (projects.length === 0) {
    elements.contentProjects.innerHTML =
      "<p>No projects yet. Create one to get started!</p>";
    elements.contentTasks.innerHTML =
      "<p>Select a project to see its tasks.</p>";
    currentProjectId = null;
    return;
  }

  if (projects.length > 0 && !currentProjectId) {
    currentProjectId = projects[0].id; // Set first project as default
  }

  projects.forEach((project) => {
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project");
    projectDiv.dataset.id = project.id;
    projectDiv.dataset.status = project.status ? "completed" : "incomplete";

    const projectTitle = document.createElement("h3");
    projectTitle.textContent = project.title;

    /* STATUS TOGGLE ICON */
    const projectStatusToggleIcon = createProjectStatusToggleIcon(project);

    /* EDIT ICON */
    const editProjectIcon = createProjectEditIcon(project);

    /* DELETE ICON */
    const deleteProjectIcon = createProjectDeleteIcon(project);

    /* ACTIVE PROJECT HANDLER ON CLICK*/
    projectDiv.addEventListener("click", () => {
      currentProjectId = project.id;
      renderTasks();
      setActiveProject(projectDiv); // Update active class
    });

    projectDiv.append(
      projectStatusToggleIcon,
      editProjectIcon,
      deleteProjectIcon,
      projectTitle
    );
    elements.contentProjects.appendChild(projectDiv);
  });

  // Set active project
  if (currentProjectId) {
    setActiveProject(
      document.querySelector(`.project[data-id="${currentProjectId}"]`)
    );
  }
  renderTasks(); // Load tasks for the first project
}

// RENDER TASKS
function renderTasks() {
  elements.contentTasks.innerHTML = ""; // Clear previous content
  if (!currentProjectId) return;

  const project = projectService.getProjectById(currentProjectId);
  if (!project) return;

  // Create the task elements
  project.tasks.forEach((taskId) => {
    const task = taskService.getTaskById(taskId);
    if (!task) return;

    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");
    taskDiv.dataset.id = task.id;
    taskDiv.dataset.status = task.status ? "completed" : "incomplete";

    const taskTitle = document.createElement("div");
    taskTitle.classList.add("task-title");
    taskTitle.textContent = task.title;

    const taskDescription = document.createElement("div");
    taskDescription.classList.add("task-description");
    taskDescription.textContent = task.description;

    const taskDueDate = document.createElement("div");
    taskDueDate.classList.add("task-due-date");
    if (task.dueDate) {
      taskDueDate.textContent = "Due: " + task.dueDate;
    }

    const taskPriority = document.createElement("div");
    taskPriority.classList.add("task-priority");
    taskPriority.textContent = "Priority: " + task.priority;

    /* EDIT ICON */
    const editTaskIcon = createTaskEditIcon(task);

    /* STATUS TOGGLE ICON */
    const taskStatusToggleIcon = createTaskStatusToggleIcon(task);

    /* DELETE ICON */
    const deleteIcon = createTaskDeleteIcon(task);

    taskDiv.append(
      taskTitle,
      taskDescription,
      taskDueDate,
      taskPriority,
      editTaskIcon,
      taskStatusToggleIcon,
      deleteIcon
    );
    elements.contentTasks.appendChild(taskDiv);
  });
}

// Function to create project edit icon
function createProjectEditIcon(project) {
  const editIcon = document.createElement("img");
  editIcon.alt = "Create project clickable icon";
  editIcon.src = pencilIcon;
  editIcon.classList.add("edit-icon");
  editIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    openEditProjectModal(project);
  });
  return editIcon;
}

// Function to create project status toggle icon
function createProjectStatusToggleIcon(project) {
  const statusToggleIcon = document.createElement("div");
  statusToggleIcon.classList.add("status-toggle-icon");
  statusToggleIcon.innerHTML = projectService.getProjectStatus(project.id)
    ? "✓"
    : "";
  statusToggleIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    projectService.toggleProjectStatus(project.id);
    renderProjects();
    if (currentProjectId === project.id) {
      setActiveProject(
        document.querySelector(`.project[data-id="${project.id}"]`)
      );
    }
  });

  return statusToggleIcon;
}

// Function to create project delete icon
function createProjectDeleteIcon(project) {
  const deleteIcon = document.createElement("img");
  deleteIcon.alt = "Delete project clickable icon";
  deleteIcon.src = trashcanIcon;
  deleteIcon.classList.add("delete-icon");

  deleteIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    showDeleteConfirmationModal(project);
  });

  return deleteIcon;
}

// Function to create task status toggle icon
function createTaskStatusToggleIcon(task) {
  const statusToggleIcon = document.createElement("div");
  statusToggleIcon.classList.add("status-toggle-icon");
  statusToggleIcon.innerHTML = taskService.getTaskStatus(task.id) ? "✓" : "";
  statusToggleIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    taskService.toggleTaskStatus(task.id);
    renderTasks();
  });
  return statusToggleIcon;
}

// Function to create task edit icon
function createTaskEditIcon(task) {
  const editIcon = document.createElement("img");
  editIcon.alt = "Edit task clickable icon";
  editIcon.src = pencilIcon;
  editIcon.classList.add("edit-icon");
  editIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    openEditTaskModal(task);
  });
  return editIcon;
}

// Function to create delete task icon
function createTaskDeleteIcon(task) {
  const deleteIcon = document.createElement("img");
  deleteIcon.alt = "Delete task clickable icon";
  deleteIcon.src = trashcanIcon;
  deleteIcon.classList.add("delete-icon");
  deleteIcon.addEventListener("click", (event) => {
    event.stopPropagation();
    taskService.deleteTask(task.id);
    renderTasks();
  });
  return deleteIcon;
}

//===============================================================================================
//-------------------------------------------EVENT LISTENERS-------------------------------------
//===============================================================================================

// HANDLE PROJECT CREATION
elements.addProjectForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("add-project-name").value.trim();
  const description = document
    .getElementById("add-project-description")
    .value.trim();
  const dueDate = document.getElementById("add-project-date").value;
  const priority = document.getElementById("add-project-priority").value;
  if (!title) {
    alert("Project name is required.");
    return;
  }

  const newProject = projectService.createProject(
    title,
    description,
    dueDate,
    priority
  );
  currentProjectId = newProject.id; // Set new project as active
  renderProjects();

  toggleModal(elements.addProjectModal, false);
  event.target.reset();
});

// HANDLE PROJECT EDIT SUBMIT
elements.editProjectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentProjectId) return;

  const updatedTitle = editProjectFields.name.value.trim();
  if (!updatedTitle) {
    alert("Project name is required.");
    return;
  }

  const updatedData = {
    title: updatedTitle,
    description: editProjectFields.description.value.trim(),
    dueDate: editProjectFields.date.value,
    priority: editProjectFields.priority.value,
  };

  projectService.updateProject(currentProjectId, updatedData);
  renderProjects();
  toggleModal(elements.editProjectModal, false);
  event.target.reset();
});

// ACTIVE PROJECT HANDLER ON CLICK
function setActiveProject(activeDiv) {
  if (activeDiv) {
    document
      .querySelectorAll(".project")
      .forEach((proj) => proj.classList.remove("active"));
    activeDiv.classList.add("active");
  }
}

// HANDLE TASK CREATION
elements.addTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentProjectId) {
    alert("Select a project first.");
    return;
  }

  const title = document.getElementById("add-task-name").value.trim();
  if (!title) {
    alert("Task name is required.");
    return;
  }

  const description = document
    .getElementById("add-task-description")
    .value.trim();
  const dueDate = document.getElementById("add-task-date").value;
  const priority = document.getElementById("add-task-priority").value;

  const newTask = taskService.createTask(title, description, dueDate, priority);
  projectService.addTaskToProject(currentProjectId, newTask.id); // Link task to project
  renderTasks();

  toggleModal(elements.addTaskModal, false);
  event.target.reset();
});

// HANDLE TASK EDIT SUBMIT
elements.editTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!currentTaskId) return;
  const updatedTitle = editTaskFields.name.value.trim();
  if (!updatedTitle) {
    alert("Task name is required.");
    return;
  }

  const updatedData = {
    title: updatedTitle,
    description: editTaskFields.description.value.trim(),
    dueDate: editTaskFields.date.value,
    priority: editTaskFields.priority.value,
  };

  taskService.updateTask(currentTaskId, updatedData);
  renderTasks();
  toggleModal(elements.editTaskModal, false);
  event.target.reset();
});

// MODAL HANDLERS FOR PROJECTS
elements.addProjectButton.addEventListener("click", () =>
  toggleModal(elements.addProjectModal, true)
);
elements.closeAddProjectModalButton.addEventListener("click", () =>
  toggleModal(elements.addProjectModal, false)
);
elements.closeEditProjectModalButton.addEventListener("click", () =>
  toggleModal(elements.editProjectModal, false)
);

// MODAL HANDLERS FOR TASKS
elements.addTaskButton.addEventListener("click", () =>
  toggleModal(elements.addTaskModal, true)
);
elements.closeAddTaskModalButton.addEventListener("click", () =>
  toggleModal(elements.addTaskModal, false)
);
elements.closeEditTaskModalButton.addEventListener("click", () =>
  toggleModal(elements.editTaskModal, false)
);

function closeModal(modal) {
  modal.remove(); // Remove the modal from the DOM
}


export { renderProjects, renderTasks };
