import { Task } from "../modules/task";

class Project {
  constructor(title, description, dueDate, priority, status = false, tasks = []) {
    this.id = crypto.randomUUID().substring(2, 9); // Unique identifier
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.status = status;
    this.tasks = tasks; // Stores task IDs for efficient management
  }

  /* GETTERS */
  getDetails() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      dueDate: this.dueDate,
      priority: this.priority,
      tasks: this.tasks, // Returns task IDs, actual tasks handled in TaskService
    };
  }

  getStatus() {
    return this.status;
  }

    /* SETTERS */
  setStatus(status) {
    this.status = status;
  }

  toggleStatus() {
    this.status = !this.status;
  }

  /* TASK MANAGEMENT */
  addTask(task) {
    if (!(task instanceof Task)) throw new Error("Invalid Task instance.");
    this.tasks.push(task.id); // Store only task ID
  }

  removeTask(taskId) {
    this.tasks = this.tasks.filter((id) => id !== taskId);
  }

  /* UPDATING PROJECT DETAILS */
  updateProject(updatedData) {
    Object.assign(this, updatedData);
  }
}

export { Project };
