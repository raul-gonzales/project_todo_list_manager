import { Project } from "../modules/project.js";

class ProjectService {
  constructor() {
    this.projects = this._loadProjects(); // Load projects from localStorage
  }

  /* CREATE */
  createProject(title, description, dueDate, priority, status = false) {
    if (!title) throw new Error("Title is required.");

    const newProject = new Project(
      title,
      description,
      dueDate,
      priority,
      status
    );
    this.projects.push(newProject);
    this._saveProjects();
    return newProject;
  }

  /* READ */
  getProjects() {
    return [...this.projects]; // Return a copy to prevent accidental mutations
  }

  getProjectById(projectId) {
    return this.projects.find((project) => project.id === projectId) || null;
  }

  getProjectStatus(projectId) {
    const projectStatus = this.getProjectById(projectId);
    return projectStatus ? projectStatus.status : null;
  }

  /* UPDATE */
  updateProject(projectId, updatedData) {
    const project = this.getProjectById(projectId);
    if (!project) {
      console.warn("Project not found!");
      return null;
    }

    Object.assign(project, updatedData);
    this._saveProjects();
    return project;
  }

  toggleProjectStatus(projectId) {
    const project = this.getProjectById(projectId);
    if (!project) {
      console.warn("Project not found!");
      return null;
    }
    project.status = !project.status;
    this._saveProjects();
    return project;
  }

  /* DELETE */
  deleteProject(projectId) {
    this.projects = this.projects.filter((project) => project.id !== projectId);
    this._saveProjects();
  }

  /* TASK MANAGEMENT */
  addTaskToProject(projectId, taskId) {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error("Project not found.");

    if (!project.tasks.includes(taskId)) {
      project.tasks.push(taskId); // Store only task ID
      this._saveProjects();
    }
  }

  removeTaskFromProject(projectId, taskId) {
    const project = this.getProjectById(projectId);
    if (!project) throw new Error("Project not found.");

    project.tasks = project.tasks.filter((id) => id !== taskId);
    this._saveProjects();
  }

  /* PERSISTENCE */
  _saveProjects() {
    try {
      localStorage.setItem("projects", JSON.stringify(this.projects));
    } catch (error) {
      console.error("Error saving projects:", error);
    }
  }

  _loadProjects() {
    try {
      return JSON.parse(localStorage.getItem("projects")) || [];
    } catch (error) {
      console.error("Error loading projects:", error);
      return [];
    }
  }

  /* SORTING */
  sortProjects(criteria) {
    const sortFunctions = {
      dueDate: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
      priority: (a, b) =>
        ["High", "Medium", "Low"].indexOf(a.priority) -
        ["High", "Medium", "Low"].indexOf(b.priority),
    };

    return [...this.projects].sort(sortFunctions[criteria]);
  }
}

export { ProjectService };
